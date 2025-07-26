import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Pagination, Row } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';
import MovieCard from '../../components/MovieCard/MovieCard';
import './TimKiem.css';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import routePath from '../../routes/routePath';

const TimKiem: React.FC = () => {
  // States
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('query') || '');
  const [movies, setMovies] = useState<Phim[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);
  const itemsPerPage = 20; // Fixed at 20 items per page (4 columns x 5 rows)

  // Search handler
  const handleSearch = async (page: number = 1, query: string = searchQuery) => {
    if (!query.trim()) {
      setMovies([]);
      setTotalPages(0);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Gọi API tìm kiếm phim với tham số query
      const response = await phimService.searchPhim({
        query: query,
        page: page,
        per_page: itemsPerPage
      });

      if (response.data) {
        setMovies(response.data.items);
        setTotalPages(response.data.pagination.last_page);
        setTotalResults(response.data.pagination.total);
        
        // Update URL params
        setSearchParams({ 
          query: query,
          page: page.toString() 
        });
        
        // Update document title with search query
        document.title = `Tìm kiếm: ${query} | Phim Hay`;
      } else {
        setError('Không thể tải kết quả tìm kiếm');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Đã có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page
    handleSearch(1);
    
    // Điều hướng URL với tham số query thay vì thay đổi qua setSearchParams
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?query=${encodeURIComponent(searchQuery.trim())}&page=1`);
    }
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(page);
    
    // Cập nhật URL với tham số query
    if (searchQuery.trim()) {
      navigate(`/tim-kiem?query=${encodeURIComponent(searchQuery.trim())}&page=${page}`);
    }
    
    // Scroll to top of results
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Sort change handler
  // Không cần hàm sort trong thiết kế đơn giản mới

  // Initial search on mount or when URL params change
  // Xử lý khi URL thay đổi hoặc khi component được tải lần đầu
  useEffect(() => {
    const queryParam = searchParams.get('query') || '';
    const page = Number(searchParams.get('page')) || 1;
    
    if (queryParam) {
      setSearchQuery(queryParam);
      setCurrentPage(page);
      handleSearch(page, queryParam);
    }
  }, [searchParams]);

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
    <>
    <CustomBreadcrumb
        items={[
          { label: 'Trang chủ', path: '/', icon: 'bi-house-door' },
          { label: `Tìm kiếm: ${searchQuery}`, path: routePath.TIM_KIEM }
        ]}
      />
    <div className="tim-kiem-page">
      <Container>

        {/* Khu vực hiển thị kết quả tìm kiếm */}
        <div>
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3">Đang tìm kiếm phim...</p>
            </div>
          ) : error ? (
            <div className="text-center my-5">
              <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
              <h2 className="mt-3">Đã xảy ra lỗi</h2>
              <p>{error}</p>
              <Button 
                variant="danger" 
                onClick={() => handleSearch()}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Thử lại
              </Button>
            </div>
          ) : movies.length > 0 ? (
            <>
              <p className="text-center mb-4">
                Tìm thấy <strong>{totalResults}</strong> kết quả cho <span className="text-danger">"{searchQuery}"</span>
              </p>
              
              {/* Grid 4 cột 5 hàng đơn giản */}
              <Row xs={2} sm={3} md={3} lg={4} className="g-3">
                {movies.map((movie: Phim) => (
                  <div key={movie.id} className="movie-grid-item">
                    <MovieCard movie={movie} />
                  </div>
                ))}
                </Row>
              
              {/* Phân trang đơn giản */}
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
          ) : searchQuery ? (
            <div className="text-center my-5">
              <i className="bi bi-search fs-1"></i>
              <h2 className="mt-3">Không tìm thấy kết quả</h2>
              <p>
                Không có phim nào phù hợp với từ khóa "{searchQuery}". 
                Hãy thử tìm kiếm với từ khóa khác.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button variant="outline-light" onClick={() => navigate('/')}>
                  <i className="bi bi-house-door me-1"></i>
                  Về trang chủ
                </Button>
                <Button variant="danger" onClick={() => setSearchQuery('')}>
                  <i className="bi bi-x-circle me-1"></i>
                  Xóa tìm kiếm
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center my-5">
              <i className="bi bi-search fs-1"></i>
              <h2 className="mt-3">Bạn muốn tìm phim gì?</h2>
              <p>
                Nhập từ khóa vào ô tìm kiếm để khám phá phim
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
    </>
  );
};

export default TimKiem;
