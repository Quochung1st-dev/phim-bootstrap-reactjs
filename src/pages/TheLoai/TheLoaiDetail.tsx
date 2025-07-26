import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Breadcrumb, Badge, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { phimService } from '../../services/api/phim.service';
import { theLoaiService } from '../../services/api/the_loai.service';
import type { Phim } from '../../types/phim.types';
import type { TheLoai as TheLoaiType } from '../../types/the_loai.types';
import MovieCard from '../../components/MovieCard/MovieCard';
import './TheLoai.css';
import './TheLoaiDetail.css';

const TheLoaiDetail: React.FC = () => {
  // States
  const { slug } = useParams<{ slug: string }>();
  
  const [movies, setMovies] = useState<Phim[]>([]);
  const [theLoaiInfo, setTheLoaiInfo] = useState<TheLoaiType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialItemsPerPage = 84; // Ban đầu hiện 84 phim
  const loadMoreCount = 42; // Mỗi lần load thêm 42 phim
  
  // Fetch thể loại info
  useEffect(() => {
    const fetchTheLoai = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Lấy thông tin thể loại bằng slug
        const allResponse = await theLoaiService.getDanhSachTheLoai();
        
        if (allResponse.data && Array.isArray(allResponse.data)) {
          // Tìm thể loại trong danh sách đã lấy
          let foundTheLoai = allResponse.data.find(t => t.slug === slug);
          
          if (foundTheLoai) {
            setTheLoaiInfo(foundTheLoai);
            document.title = `${foundTheLoai.ten} | Phim Hay`;
          } else {
            // Nếu không tìm thấy, gọi API chi tiết
            try {
              const detailResponse = await theLoaiService.getChiTietTheLoai(slug);
              if (detailResponse.data && Array.isArray(detailResponse.data) && detailResponse.data.length > 0) {
                // API này trả về danh sách phim, nhưng chúng ta cần thông tin thể loại
                setError('Không tìm thấy thể loại');
                document.title = 'Thể loại không tồn tại | Phim Hay';
              } else {
                setError('Không tìm thấy thể loại');
                document.title = 'Thể loại không tồn tại | Phim Hay';
              }
            } catch (detailErr) {
              console.error('Failed to fetch genre detail:', detailErr);
              setError('Không tìm thấy thể loại');
              document.title = 'Thể loại không tồn tại | Phim Hay';
            }
          }
        } else {
          setError('Không thể tải thông tin thể loại');
        }
      } catch (err) {
        console.error('Failed to fetch genre info:', err);
        setError('Đã có lỗi xảy ra khi tải thông tin thể loại');
      }
    };
    
    fetchTheLoai();
  }, [slug]);
  
  // Fetch movies by genre
  useEffect(() => {
    const fetchMovies = async () => {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      setMovies([]); // Reset movies khi slug thay đổi
      setCurrentPage(1); // Reset về trang 1 khi slug thay đổi
      setHasMore(true); // Reset hasMore khi slug thay đổi
      
      try {
        const params = {
          page: 1,
          per_page: initialItemsPerPage // 84 phim ban đầu
        };
        
        const response = await phimService.getPhimByTheLoai(slug, params);
        
        if (response && response.data) {
          setMovies(response.data.items);
          setTotalResults(response.data.pagination.total);
          
          // Kiểm tra xem có phim để load thêm không
          setHasMore(response.data.pagination.current_page < response.data.pagination.last_page);
          
          // Log số lượng phim đã load
          console.log(`Đã tải ${response.data.items.length}/${response.data.pagination.total} phim thể loại`);
        } else {
          setError('Không thể tải danh sách phim');
        }
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError('Đã có lỗi xảy ra khi tải danh sách phim');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovies();
  }, [slug, initialItemsPerPage]);
  
  // Hàm để load thêm phim
  const loadMoreMovies = async () => {
    if (!slug || loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const params = {
        page: nextPage,
        per_page: loadMoreCount // 42 phim mỗi lần load thêm
      };
      
      const response = await phimService.getPhimByTheLoai(slug, params);
      
      if (response && response.data && response.data.items) {
        // Thêm vào danh sách phim hiện tại
        const items = response?.data?.items || [];
        setMovies(prevMovies => [...prevMovies, ...items]);
        setCurrentPage(nextPage);
        
        // Kiểm tra xem còn phim để load thêm không
        setHasMore(response.data.pagination.current_page < response.data.pagination.last_page);
        
        // Log số lượng phim đã load
        console.log(`Đã tải thêm ${items.length} phim, tổng cộng ${movies.length + items.length}/${response.data.pagination.total}`);
        
        // Scroll một chút xuống dưới để người dùng thấy phim mới đã được tải
        setTimeout(() => {
          window.scrollBy({
            top: 200,
            behavior: 'smooth'
          });
        }, 100);
      }
    } catch (err) {
      console.error('Failed to load more movies:', err);
    } finally {
      setLoadingMore(false);
    }
  };
  
  return (
    <div className="the-loai-detail-page">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb className="my-3">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/the-loai' }}>Thể loại</Breadcrumb.Item>
          {theLoaiInfo && (
            <Breadcrumb.Item active>{theLoaiInfo.ten}</Breadcrumb.Item>
          )}
        </Breadcrumb>

        {/* Tiêu đề và mô tả thể loại */}
        <div className="genre-header mb-4">
          <h1 className="genre-title">
            {theLoaiInfo ? `Phim ${theLoaiInfo.ten}` : 'Đang tải...'}
          </h1>
          
          {theLoaiInfo && (
            <p className="genre-description mt-3">
              {theLoaiInfo.mo_ta || `Tổng hợp những bộ phim ${theLoaiInfo.ten} hay nhất, được chọn lọc và cập nhật liên tục.`}
            </p>
          )}
        </div>
        
        {/* Khu vực hiển thị danh sách phim */}
        <div className="movie-results">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3">Đang tải danh sách phim...</p>
            </div>
          ) : error ? (
            <div className="text-center my-5">
              <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
              <h2 className="mt-3">Đã xảy ra lỗi</h2>
              <p>{error}</p>
            </div>
          ) : movies.length > 0 ? (
            <>
              <p className="text-center mb-4">
                Tìm thấy <strong>{totalResults}</strong> phim thể loại <span className="text-danger">{theLoaiInfo?.ten}</span>
              </p>
              
              {/* Grid 4 cột 5 hàng */}
              <div className="movie-grid">
                {movies.map((movie) => (
                  <div key={movie.id} className="movie-grid-item">
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
              
              {/* Nút load thêm */}
              {hasMore && (
                <div className="text-center mt-4">
                  <Button 
                    variant="outline-danger" 
                    size="lg" 
                    onClick={loadMoreMovies}
                    disabled={loadingMore}
                    className="load-more-btn"
                  >
                    {loadingMore ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Xem Thêm Phim
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center my-5">
              <i className="bi bi-film fs-1"></i>
              <h2 className="mt-3">Không có phim nào</h2>
              <p>
                Hiện tại chưa có phim nào thuộc thể loại này. Vui lòng quay lại sau.
              </p>
              <Link to="/" className="btn btn-outline-light">
                <i className="bi bi-house-door me-1"></i>
                Về trang chủ
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default TheLoaiDetail;
