import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';
import './PhimChiTiet.css';
import MovieCard from '../../components/MovieCard/MovieCard';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';

const PhimChiTiet: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [movie, setMovie] = useState<Phim | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [relatedMovies, setRelatedMovies] = useState<Phim[]>([]);
    const [relatedMoviesPage, setRelatedMoviesPage] = useState<number>(1);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasMoreRelatedMovies, setHasMoreRelatedMovies] = useState<boolean>(true);
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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-2 text-light">Đang tải thông tin phim...</p>
      </Container>
    );
  }

  if (error || !movie) {
    return (
      <Container className="py-5 text-center">
        <div className="error-container">
          <h3 className="text-danger">Đã có lỗi xảy ra</h3>
          <p className="text-light">{error || "Không thể tải thông tin phim"}</p>
          <Button variant="outline-light" onClick={() => window.history.back()}>
            Quay lại
          </Button>
        </div>
      </Container>
    );
  }

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
      <Container className="movie-detail-container py-5">
        <Row>
          {/* Left column - Movie content (8 units) */}
          <Col lg={8} md={7} sm={12}>
            <div className="movie-main-content">
              <h1 className="movie-title">{movie.ten}</h1>
              
              <div className="movie-categories mb-4">
                {movie.the_loai && movie.the_loai.map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/the-loai/${category.slug}`} 
                    className="text-decoration-none"
                  >
                    <Badge key={category.id} bg="danger" className="me-2">
                      {category.ten}
                    </Badge>
                  </Link>
                ))}
              </div>

              <div className="movie-description mb-4">
                <h3>Nội Dung</h3>
                <p>{movie.mo_ta || "Không có mô tả cho phim này."}</p>
              </div>
              
              <div className="movie-actions mb-4">
                <Button 
                  variant="danger" 
                  size="lg" 
                  className="me-3"
                  onClick={() => {
                    const playerElement = document.querySelector('.movie-player');
                    if (playerElement) {
                      playerElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <i className="bi bi-play-fill me-2"></i>
                  Xem Phim
                </Button>
                <Button variant="outline-light">
                  <i className="bi bi-bookmark-plus me-2"></i>
                  Lưu
                </Button>
              </div>

              <div className="movie-player-container">
                <h3 className="mb-3">Xem Phim</h3>
                <div className="movie-player">
                  {movie.link_online ? (
                    <iframe 
                      src={movie.link_online}
                      title={movie.ten}
                      frameBorder="0"
                      allowFullScreen
                      className="movie-iframe"
                    ></iframe>
                  ) : (
                    <div className="no-video-placeholder">
                      <i className="bi bi-film"></i>
                      <p>Không có link phim</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>

          {/* Right column - Sidebar (4 units) */}
          <Col lg={4} md={5} sm={12}>
            <div className="movie-sidebar">
              <div className="movie-poster-container mb-4">
                <img 
                  src={movie.hinh_anh || 'https://via.placeholder.com/300x450?text=No+Image'} 
                  alt={movie.ten}
                  className="movie-poster"
                />
                <div className="movie-rating">
                  <i className="bi bi-star-fill"></i>
                  <span>8.5</span>
                </div>
              </div>

              <div className="movie-info-box">
                <h3 className="mb-3">Thông Tin</h3>
                
                <div className="info-item">
                  <span className="info-label">Thể loại:</span>
                  <span className="info-value">
                    {movie.the_loai?.map((c, index) => (
                      <React.Fragment key={c.id}>
                        <Link to={`/the-loai/${c.slug}`} className="genre-link">
                          {c.ten}
                        </Link>
                        {index < movie.the_loai!.length - 1 ? ', ' : ''}
                      </React.Fragment>
                    )) || 'Không xác định'}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">Ngày tạo:</span>
                  <span className="info-value">
                    {new Date(movie.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Lượt xem:</span>
                  <span className="info-value">
                    {Math.floor(Math.random() * 10000) + 1000} {/* Random view count for demo */}
                  </span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Chất lượng:</span>
                  <span className="info-value">
                    HD
                  </span>
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
                      Xem Thêm Phim Liên Quan
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
    </>
  );
};

export default PhimChiTiet;
