import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';
import './PhimChiTiet.css';
import MovieCard from '../../components/MovieCard/MovieCard';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import { toast } from 'react-toastify';

const PhimChiTiet: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [movie, setMovie] = useState<Phim | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [relatedMovies, setRelatedMovies] = useState<Phim[]>([]);
    const [relatedMoviesPage, setRelatedMoviesPage] = useState<number>(1);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasMoreRelatedMovies, setHasMoreRelatedMovies] = useState<boolean>(true);
    const [selectedServer, setSelectedServer] = useState<number>(1); // 1 for server 1, 2 for server 2
    const [zoomedImage, setZoomedImage] = useState<string | null>(null); // For image zoom
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Function to handle image zoom
  const handleImageZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };

  // Function to close zoom
  const closeZoom = () => {
    setZoomedImage(null);
  };
  
  // Function to get video source based on selected server
  const getVideoSource = () => {
    if (selectedServer === 1) {
      // Server 1: Use online link
      return movie?.link_online || '';
    } else {
      // Server 2: Use local link
      return movie?.link_phim_local || '';
    }
  };

  // Function to handle server change
  const handleServerChange = (serverNumber: number) => {
    setSelectedServer(serverNumber);
    const video = videoRef.current;
    if (video) {
      // Pause current video
      video.pause();
      // Get new source based on selected server
      const newSource = serverNumber === 1 ? movie?.link_online : movie?.link_phim_local;
      if (newSource) {
        console.log('Setting video source:', newSource);
        // Update source element
        const sourceElement = video.querySelector('source');
        if (sourceElement) {
          sourceElement.src = newSource;
          video.load(); // Reload video with new source
        }
      }
    }
  };

  // Function to handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Handle video load events
      const handleLoadedData = () => {
        console.log('Video loaded successfully');
      };
      
      const handleError = (e: Event) => {
        console.error('Video loading error:', e);
      };
      
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('error', handleError);
      };
    }
  }, [movie]);

  // Set video source when movie loads
  useEffect(() => {
    const video = videoRef.current;
    if (video && movie) {
      const source = getVideoSource();
      if (source) {
        console.log('Setting video source:', source);
        video.src = source;
        video.load();
      }
    }
  }, [movie, selectedServer]);

  // Auto select available server when movie loads
  useEffect(() => {
    if (movie) {
      // If current server doesn't have video, switch to available server
      if (selectedServer === 1 && !movie.link_online && movie.link_phim_local) {
        setSelectedServer(2);
      } else if (selectedServer === 2 && !movie.link_phim_local && movie.link_online) {
        setSelectedServer(1);
      }
    }
  }, [movie, selectedServer]);
    const params = useParams();
    const slug = params.slug;

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      setRelatedMoviesPage(1); // Reset page when slug changes
      setHasMoreRelatedMovies(true); // Reset hasMore when slug changes
      
      try {
        if (!slug) {
          throw new Error("Không tìm thấy mã phim");
        }

        const response = await phimService.getPhimBySlug(slug);
        if (response.data) {
          setMovie(response.data);
          // Update document title with movie name
          document.title = `${response.data.ten} | Phim Hay`;
          // Also save to localStorage viewed movies if this feature exists
          if (phimService.savePhimDaXemLocalStorage) {
            await phimService.savePhimDaXemLocalStorage(response.data);
          }
            
          // Fetch related movies (first page)
          await loadRelatedMovies(slug, 1);
        } else {
          setError("Không thể tải thông tin phim");
        }
      } catch (err) {
        setError("Đã có lỗi xảy ra khi tải thông tin phim");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
    
    // Restore original title when component unmounts
    return () => {
      document.title = 'Phim Hay';
    };
  }, [slug]);
  
  // Function to load related movies
  const loadRelatedMovies = async (slugParam: string, page: number) => {
    if (!slugParam) return;
    
    try {
      setIsLoadingMore(true);
      
      const params = {
        page: page,
        per_page: 8 // 4 movies per page (1 row of 4 columns)
      };
      
      const relatedResponse = await phimService.getPhimLienQuan(slugParam, params);
      
      if (relatedResponse.data) {
        const newMovies = relatedResponse.data.items;
        
        if (page === 1) {
          // First page: replace existing movies
          setRelatedMovies(newMovies);
        } else {
          // Subsequent pages: append to existing movies
          setRelatedMovies(prev => [...prev, ...newMovies]);
        }
        
        // Check if we've reached the end
        if (newMovies.length === 0 || 
            !relatedResponse.data.pagination || 
            relatedResponse.data.pagination.current_page >= relatedResponse.data.pagination.last_page) {
          setHasMoreRelatedMovies(false);
        } else {
          setHasMoreRelatedMovies(true);
        }
        
        // Update page number
        setRelatedMoviesPage(page);
      }
    } catch (err) {
      console.error("Error loading related movies:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Function to handle load more button click
  const handleLoadMoreRelatedMovies = () => {
    if (slug && !isLoadingMore && hasMoreRelatedMovies) {
      loadRelatedMovies(slug, relatedMoviesPage + 1);
    }
  };

  const handleActionLike = async (slug: string) => {
    if (!slug) return;
    try {
      const response = await phimService.likePhimAction(slug);
      if (response.success) {
        toast.success('Thích phim thành công!');
      } else {
        toast.error('Không thể thích phim này');
      }
    } catch (err) {
      console.error('Error liking movie:', err);
      toast.error('Đã có lỗi xảy ra khi thích phim');
    }
  }

  const handleLuuTruPhim = async (phim: Phim) => {
    try {
      await phimService.savePhimLuuTruLocalStorage(phim);
      toast.success('Đã lưu phim vào danh sách yêu thích');
    } catch (err) {
      console.error('Error saving movie:', err);
      toast.error('Đã có lỗi xảy ra khi lưu phim');
    }
  };

  if (loading) return;

  if (error || !movie) return;

  return (
    <>
    <Container>
      <CustomBreadcrumb
        items={[
          { label: 'Trang chủ', path: '/', icon: 'bi-house-door' },
          { label: 'Phim' },
          { label: movie.ten, path: `/${movie.slug}` }
        ]}
      />
    </Container>
    <div className="phim-chi-tiet-page">
      <Container className="movie-detail-container">
        {/* Video Player Section - Full Width */}
        <Row className="mb-4">
          <Col xs={12}>
            <div className="movie-player-container">
              <div className="movie-player">
                {(movie.link_online || movie.link_phim_local) ? (
                  <video 
                    ref={videoRef}
                    controls 
                    width="100%" 
                    height="auto"
                  >
                    <source src={getVideoSource()} type="video/mp4" />
                    Trình duyệt không hỗ trợ HTML5 video.
                  </video>
                ) : (
                  <div className="no-video-placeholder">
                    <i className="bi bi-film"></i>
                    <p>Không có link phim</p>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>

        {/* Movie Info Section - 8/4 Layout */}
        <Row>
          {/* Left column - Movie Info (8 units) */}
          <Col lg={8} md={8} sm={12}>
            <div className="movie-info-content">
              
              <h1 className="movie-title">{movie.ten}</h1>
              {/* 3 Info Items - Inline */}
              <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
                <div className="d-flex align-items-center me-4 mb-2">
                  <i className="bi bi-calendar-date me-2"></i>
                  <span>
                    <strong>Ngày đăng:</strong> {new Date(movie.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <div className="d-flex align-items-center me-4 mb-2">
                  <i className="bi bi-eye me-2"></i>
                  <span>
                    <strong>Lượt xem:</strong> {movie.view.toLocaleString()}
                  </span>
                </div>
                
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-heart-fill me-2"></i>
                  <span>
                    <strong>Lượt thích:</strong> {movie.likes.toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Movie Categories - simple layout */}
              <div className="movie-categories-section">
                <div className="movie-categories">
                  {movie.the_loai && movie.the_loai.map((category) => (
                    <Link 
                      key={category.id} 
                      to={`/the-loai/${category.slug}`} 
                      className="text-decoration-none"
                    >
                      <Badge bg="danger" className="me-2 mb-2">
                        {category.ten}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              

              {/* Movie Description with thumbnails */}
              <div className="movie-description">
                {movie.hinh_anh_thumb && (
                  <div className="description-thumbnails mb-3">
                    <Row className="g-2">
                      {movie.hinh_anh_thumb.map((thumb, index) => (
                        <Col key={index} xs={6} sm={4} md={3}>
                          <div className="thumbnail-container" onClick={() => handleImageZoom(thumb.link)}>
                            <img 
                              src={thumb.link} 
                              alt={`${movie.ten} - Thumbnail ${index + 1}`}
                              className="description-thumb"
                              loading="lazy"
                            />
                            <div className="thumbnail-overlay">
                              <i className="bi bi-zoom-in"></i>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}
              </div>
            </div>
          </Col>

          {/* Right column - Action Buttons (4 units) */}
          <Col lg={4} md={4} sm={12}>
            <div className="movie-actions-sidebar">
              {/* Movie Poster */}
              <div className="movie-poster-container mb-4">
                <img 
                  src={movie.hinh_anh || 'https://via.placeholder.com/300x450?text=No+Image'} 
                  alt={movie.ten}
                  className="movie-poster-small"
                />
              </div>

              <div className="action-buttons">
                {/* Row 1: Server Selection - 2 buttons side by side */}
                <div className="server-selection mb-3">
                  <Row className="g-2">
                    <Col xs={6}>
                      <Button 
                        variant={selectedServer === 1 ? "primary" : "outline-primary"}
                        onClick={() => handleServerChange(1)}
                        className="w-100 server-btn"
                        size="sm"
                        disabled={!movie.link_online}
                      >
                        <i className="bi bi-play-circle me-1"></i>
                        Server 1
                        {!movie.link_online && <small className="d-block">Không có</small>}
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button 
                        variant={selectedServer === 2 ? "primary" : "outline-primary"}
                        onClick={() => handleServerChange(2)}
                        className="w-100 server-btn"
                        size="sm"
                        disabled={!movie.link_phim_local}
                      >
                        <i className="bi bi-play-circle me-1"></i>
                        Server 2
                        {!movie.link_phim_local && <small className="d-block">Không có</small>}
                      </Button>
                    </Col>
                  </Row>
                </div>

                {/* Row 2: Save and Like - 2 buttons side by side */}
                <div className="action-row-2 mb-3">
                  <Row className="g-2">
                    <Col xs={6}>
                      <Button variant="outline-light" className="w-100 action-btn" size="sm" onClick={() => handleLuuTruPhim(movie)}>
                        <i className="bi bi-bookmark-plus me-1"></i>
                        Lưu Trữ
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button variant="outline-danger" className="w-100 action-btn" size="sm" onClick={() => handleActionLike(movie.slug)}>
                        <i className="bi bi-heart me-1"></i>
                        Like
                      </Button>
                    </Col>
                  </Row>
                </div>

                {/* Row 3: Share - full width button */}
                <div className="action-row-3">
                  <Button variant="outline-info" className="w-100 action-btn" size="sm">
                    <i className="bi bi-share me-2"></i>
                    Chia Sẻ
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <div className="related-movies-section mt-5">
          <div className="section-header mb-4">
            <h2 className="section-title">Phim Liên Quan</h2>
            <div className="section-divider"></div>
          </div>
          <Row>
            {/* các phim liên quan 4 cột đều */}
            {relatedMovies.map((relatedMovie) => (
              <Col key={relatedMovie.id} lg={3} md={4} sm={6} className="mb-4">
                <MovieCard movie={relatedMovie} />
              </Col>
            ))}
          </Row>
          
          {relatedMovies.length > 0 && (
            <div className="text-center mt-4 load-more-container">
              {hasMoreRelatedMovies ? (
                <Button 
                  variant="outline-danger" 
                  size="lg" 
                  onClick={handleLoadMoreRelatedMovies}
                  disabled={isLoadingMore}
                  className="load-more-btn"
                >
                  {isLoadingMore ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Xem Thêm
                    </>
                  )}
                </Button>
              ) : (
                <div className="no-more-movies">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  <span className="text-muted">Đã hiển thị tất cả phim liên quan</span>
                </div>
              )}
            </div>
          )}
          
          {relatedMovies.length === 0 && !isLoadingMore && (
            <div className="text-center py-5 empty-movies-container">
              <div className="empty-state">
                <i className="bi bi-film me-2"></i>
                <p>Không có phim liên quan nào</p>
                <small className="text-muted mt-2">Hãy thử xem các phim khác</small>
                <div className="mt-3">
                  <Link to="/" className="btn btn-outline-light">
                    Xem Phim Mới
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
    
    {/* Image Zoom Modal */}
    {zoomedImage && (
      <div className="image-zoom-modal" onClick={closeZoom}>
        <div className="zoom-overlay">
          <img 
            src={zoomedImage} 
            alt="Zoomed image" 
            className="zoomed-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    )}
    </>
  );
};

export default PhimChiTiet;
