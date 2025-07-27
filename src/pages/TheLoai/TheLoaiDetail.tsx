import React, { useState, useEffect } from 'react';
import { Container, Button, Row } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { theLoaiService } from '../../services/api/the_loai.service';
import type { Phim } from '../../types/phim.types';
import MovieCard from '../../components/MovieCard/MovieCard';
import './TheLoaiDetail.css';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import routePath from '../../routes/routePath';
import CustomPagination from '../../components/CustomPagination';

const TheLoaiDetail: React.FC = () => {
  // States
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Phim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [tenTheLoai, setTenTheLoai] = useState<string>('');

  // Fetch phim theo thể loại
  const fetchMoviesByGenre = async (page: number = 1) => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      // Gọi API lấy phim theo thể loại với tham số phân trang
      const response = await theLoaiService.getChiTietTheLoai(slug, { page: page, per_page: 20 });

      if (response.data) {
        // Lấy danh sách phim từ API
        setMovies(response.data.items);
        setTenTheLoai(response.message || '');
        
        // Lấy thông tin phân trang từ API
        setTotalPages(response.data.pagination.last_page);
        setTotalResults(response.data.pagination.total);
        
        // Lấy thông tin thể loại từ phim đầu tiên (nếu có)
        if (response.data.items.length > 0 && response.data.items[0].the_loai) {
          const currentTheLoai = response.data.items[0].the_loai.find(tl => tl.slug === slug);
          if (currentTheLoai) {
            // Cập nhật tiêu đề trang
            document.title = `${currentTheLoai.ten} | Phim Hay`;
          }
        }
        
        // Cập nhật URL params
        setSearchParams({ 
          page: page.toString() 
        });
      } else {
        setError('Không thể tải danh sách phim');
      }
    } catch (err) {
      console.error('Failed to fetch movies by genre:', err);
      setError('Đã có lỗi xảy ra khi tải danh sách phim');
    } finally {
      setLoading(false);
    }
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Cập nhật URL với tham số page
    navigate(`/the-loai/${slug}?page=${page}`);
    
    // Tải phim cho trang mới từ API
    fetchMoviesByGenre(page);
    
    // Scroll to top of results
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Initial fetch on mount or when slug changes
  useEffect(() => {
    const page = Number(searchParams.get('page')) || 1;
    setCurrentPage(page);
    fetchMoviesByGenre(page);
  }, [slug]);

  // Không cần phân trang ở client nữa vì API đã trả về dữ liệu đã được phân trang



  return (
    <>
    <Container>
        <CustomBreadcrumb
        items={[
          { label: 'Trang chủ', path: '/', icon: 'bi-house-door' },
          { label: 'Thể loại', path: routePath.THE_LOAI.LIST },
          { label: tenTheLoai || 'Đang tải...' }
        ]}
      />
    </Container>
    <div className="the-loai-detail-page">
      <Container>


        {/* Khu vực hiển thị danh sách phim theo thể loại */}
        <div>
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
              <Button 
                variant="danger" 
                onClick={() => fetchMoviesByGenre(currentPage)}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Thử lại
              </Button>
            </div>
          ) : movies.length > 0 ? (
            <>
              
              <p className="text-center mb-4">
                Tìm thấy <strong>{totalResults}</strong> phim thuộc thể loại này
              </p>
              
              {/* Grid 4 cột 5 hàng đơn giản */}
              <Row xs={2} sm={3} md={4} lg={5} className="g-3">
                {movies.map((movie: Phim) => (
                  <div key={movie.id} className="movie-grid-item">
                    <MovieCard movie={movie} />
                  </div>
                ))}
                </Row>
              {/* Phân trang */}
              {totalPages > 1 && (
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
  
            </>
          ) : (
            <div className="text-center my-5">
              <i className="bi bi-film fs-1"></i>
              <h2 className="mt-3">Không tìm thấy phim</h2>
              <p>
                Không có phim nào thuộc thể loại này.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="outline-light" onClick={() => navigate('/')}>
                  <i className="bi bi-house-door me-1"></i>
                  Về trang chủ
                </Button>
                <Button variant="danger" onClick={() => navigate('/the-loai')}>
                  <i className="bi bi-grid me-1"></i>
                  Xem thể loại khác
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
    </>
  );
};

export default TheLoaiDetail;
