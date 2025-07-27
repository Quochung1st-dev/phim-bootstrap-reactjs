import React, { useState, useEffect } from 'react';
import { Container, Button, Row } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import routePath, { createPhimXemNhieuUrl } from '../../routes/routePath';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import type { BreadcrumbItem } from '../../components/CustomBreadcrumb';
import CustomPagination from '../../components/CustomPagination';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';
import MovieCard from '../../components/MovieCard/MovieCard';
import './PhimXemNhieu.css';

const PhimXemNhieu: React.FC = () => {
  // States
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Phim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);
  const itemsPerPage = 20; // Hiển thị 20 phim mỗi trang
  
  // Fetch phim xem nhiều
  useEffect(() => {
    const fetchPhimXemNhieu = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page: currentPage,
          per_page: itemsPerPage
        };
        
        const response = await phimService.getPhimXemNhieuNhat(params); // Changed API call
        
        if (response.data && response.data.items) {
          setMovies(response.data.items);
          
          // Lấy thông tin phân trang từ API
          setTotalPages(response.data.pagination.last_page);
          setTotalResults(response.data.pagination.total);
          
          // Cập nhật URL params
          setSearchParams({ 
            page: currentPage.toString() 
          });
          
          // Cập nhật tiêu đề trang
          document.title = 'Phim Xem Nhiều Nhất | Phim Hay'; // Changed document title
        } else {
          setError('Không thể tải danh sách phim xem nhiều');
        }
      } catch (err) {
        console.error('Failed to fetch most viewed movies:', err);
        setError('Đã có lỗi xảy ra khi tải danh sách phim xem nhiều');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhimXemNhieu();
  }, [currentPage, setSearchParams]);
  
  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Cập nhật URL với tham số page
    navigate(createPhimXemNhieuUrl(page)); // Changed URL creation function
    
    // Scroll to top of results
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <>
      <Container>
        <CustomBreadcrumb
        items={[
          { label: 'Trang chủ', path: '/', icon: 'bi-house-door' },
          { label: 'Phim xem nhiều', path: routePath.PHIM_XEM_NHIEU } // Changed breadcrumb label and path
        ]}
      />
      </Container>
    
    <div className="phim-xem-nhieu-page"> {/* Changed class name */}
      <Container>
        {/* Khu vực hiển thị danh sách phim xem nhiều */}
        <div>
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3">Đang tải danh sách phim xem nhiều...</p>
            </div>
          ) : error ? (
            <div className="text-center my-5">
              <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
              <h2 className="mt-3">Đã xảy ra lỗi</h2>
              <p>{error}</p>
              <Button 
                variant="danger" 
                onClick={() => setCurrentPage(currentPage)}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Thử lại
              </Button>
            </div>
          ) : movies.length > 0 ? (
            <>
              <Row xs={2} sm={3} md={3} lg={4} className="g-3">
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
              <h2 className="mt-3">Không có phim xem nhiều</h2>
              <p>
                Hiện tại chưa có phim xem nhiều nào.
              </p>
              <Button variant="outline-light" onClick={() => navigate('/')}>
                <i className="bi bi-house-door me-1"></i>
                Về trang chủ
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
    </>
  );
};

export default PhimXemNhieu;
