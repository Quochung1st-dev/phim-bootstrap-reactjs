import React, { useState, useEffect } from 'react';
import { Container, Breadcrumb, Pagination, Button, Row } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { createPhimMoiUrl } from '../../routes/routePath';
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
  const [totalResults, setTotalResults] = useState<number>(0);
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
          setTotalResults(response.data.pagination.total);
          
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
  
  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    
    // Show first page
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </Pagination.Item>
    );

    // Show dots if there are many pages and we're not at the beginning
    if (currentPage > 3) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        items.push(
          <Pagination.Item
            key={i}
            active={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </Pagination.Item>
        );
      }
    }

    // Show dots if there are many pages and we're not at the end
    if (currentPage < totalPages - 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    // Show last page if we have more than 1 page
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };
  
  return (
    <div className="phim-moi-page">
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb className="my-3">
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Phim mới</Breadcrumb.Item>
        </Breadcrumb>
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
              <p className="text-center mb-4">
                Tổng cộng <strong>{totalResults}</strong> phim mới cập nhật
              </p>
              
              <Row xs={2} sm={3} md={3} lg={4} className="g-3">
                {movies.map((movie: Phim) => (
                  <div key={movie.id} className="movie-grid-item">
                    <MovieCard movie={movie} />
                  </div>
                ))}
                </Row>
              
              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First 
                      onClick={() => handlePageChange(1)} 
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    />
                    
                    {getPaginationItems()}
                    
                    <Pagination.Next
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                    <Pagination.Last 
                      onClick={() => handlePageChange(totalPages)} 
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
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
  );
};

export default PhimMoi;
