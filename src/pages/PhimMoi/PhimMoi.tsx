import React, { useState, useEffect } from 'react';
import { Container, Button, Row } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import routePath, { createPhimMoiUrl } from '../../routes/routePath';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import CustomPagination from '../../components/CustomPagination';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';
import MovieCard from '../../components/MovieCard/MovieCard';
import './PhimMoi.css';

const PhimMoi: React.FC = () => {
  // States
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Phim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const itemsPerPage = 20; // Hiển thị 20 phim mỗi trang
  
  // Fetch phim mới cập nhật
  useEffect(() => {
    const fetchPhimMoi = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = {
          page: currentPage,
          per_page: itemsPerPage
        };
        
        const response = await phimService.getPhimMoiCapNhat(params);
        
        if (response.data && response.data.items) {
          setMovies(response.data.items);
          
          // Lấy thông tin phân trang từ API
          setTotalPages(response.data.pagination.last_page);
          
          // Cập nhật URL params
          setSearchParams({ 
            page: currentPage.toString() 
          });
          
          // Cập nhật tiêu đề trang
          document.title = 'Phim Mới Cập Nhật | Phim Hay';
        } else {
          setError('Không thể tải danh sách phim mới');
        }
      } catch (err) {
        console.error('Failed to fetch new movies:', err);
        setError('Đã có lỗi xảy ra khi tải danh sách phim mới');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhimMoi();
  }, [currentPage, setSearchParams]);
  
  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Cập nhật URL với tham số page
    navigate(createPhimMoiUrl(page));
    
    // Scroll to top of results
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Không cần hàm getPaginationItems nữa vì đã dùng CustomPagination
  
  return (
    <>
      <Container>
        <CustomBreadcrumb
        items={[
          { label: 'Trang chủ', path: '/', icon: 'bi-house-door' },
          { label: 'Phim mới', path: routePath.PHIM_MOI }
        ]}
      />
      </Container>
    
    <div className="phim-moi-page">
      <Container>
        {/* Khu vực hiển thị danh sách phim mới */}
        <div>
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3">Đang tải danh sách phim mới...</p>
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
              <h2 className="mt-3">Không có phim mới</h2>
              <p>
                Hiện tại chưa có phim mới được cập nhật.
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

export default PhimMoi;
