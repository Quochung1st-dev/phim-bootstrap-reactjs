import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';
import MovieCard from '../../components/MovieCard/MovieCard';
import './TimKiem.css';

const TimKiem: React.FC = () => {
  // States
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [movies, setMovies] = useState<Phim[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('relevance');
  const itemsPerPage = 20; // Fixed at 20 items per page

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
          q: query,
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
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch(page);
    
    // Scroll to top of results
    window.scrollTo({
      top: document.querySelector('.search-results-container')?.getBoundingClientRect().top 
        ? window.scrollY + (document.querySelector('.search-results-container')?.getBoundingClientRect().top || 0) - 100
        : 0,
      behavior: 'smooth'
    });
  };

  // Sort change handler
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    // In a real application, you would update the API call to include sort parameters
  };

  // Initial search on mount or when URL params change
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const page = Number(searchParams.get('page')) || 1;
    
    if (query) {
      setSearchQuery(query);
      setCurrentPage(page);
      handleSearch(page, query);
    }
  }, []);

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
    <div className="tim-kiem-page">
      <Container>
        <div className="search-header">
          <div className="search-header-content">
            <h1 className="search-title">Tìm Kiếm Phim</h1>
            
            <Form onSubmit={handleSubmit} className="search-form">
              <div className="search-input-wrapper">
                <i className="bi bi-search search-input-icon"></i>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên phim, diễn viên hoặc đạo diễn..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                />
                <Button 
                  variant="danger" 
                  type="submit"
                  className="search-button"
                  disabled={loading || !searchQuery.trim()}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-search"></i>
                  )}
                  <span>Tìm kiếm</span>
                </Button>
              </div>
            </Form>
            
            <div className="search-tips">
              Gợi ý: Nhập tên phim, diễn viên, thể loại hoặc đạo diễn để có kết quả tốt nhất
            </div>
          </div>
        </div>

        <div className="search-results-container">
          {loading ? (
            <div className="search-loading">
              <div className="spinner-border text-danger search-loading-spinner" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="search-loading-text">Đang tìm kiếm phim phù hợp...</p>
            </div>
          ) : error ? (
            <div className="search-state">
              <i className="bi bi-exclamation-triangle search-state-icon error"></i>
              <h2 className="search-state-title">Đã xảy ra lỗi</h2>
              <p className="search-state-message">{error}</p>
              <Button 
                variant="danger" 
                onClick={() => handleSearch()}
                className="search-state-button"
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Thử lại
              </Button>
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="search-results-info">
                <p className="search-results-count">
                  Tìm thấy <strong>{totalResults}</strong> kết quả cho <span className="search-results-query">"{searchQuery}"</span>
                </p>
                <div className="search-results-sort">
                  <label htmlFor="sort-select">Sắp xếp:</label>
                  <Form.Select 
                    id="sort-select" 
                    size="sm" 
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    <option value="relevance">Liên quan nhất</option>
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Phổ biến nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </Form.Select>
                </div>
              </div>
              
              <Row className="movie-grid">
                {movies.map((movie) => (
                  <Col key={movie.id} lg={3} md={4} sm={6} xs={12} className="movie-grid-item">
                    <MovieCard movie={movie} />
                  </Col>
                ))}
              </Row>
              
              {totalPages > 1 && (
                <div className="pagination-container">
                  <Pagination className="custom-pagination">
                    <Pagination.Prev
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      <i className="bi bi-chevron-left"></i>
                    </Pagination.Prev>
                    
                    {getPaginationItems()}
                    
                    <Pagination.Next
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      <i className="bi bi-chevron-right"></i>
                    </Pagination.Next>
                  </Pagination>
                </div>
              )}
            </>
          ) : searchQuery ? (
            <div className="search-state">
              <i className="bi bi-search search-state-icon"></i>
              <h2 className="search-state-title">Không tìm thấy kết quả</h2>
              <p className="search-state-message">
                Không có phim nào phù hợp với từ khóa "{searchQuery}". 
                Hãy thử tìm kiếm với từ khóa khác hoặc kiểm tra lại chính tả.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  variant="outline-light" 
                  onClick={() => navigate('/')}
                  className="search-state-button"
                >
                  <i className="bi bi-house-door me-1"></i>
                  Về trang chủ
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => setSearchQuery('')}
                  className="search-state-button"
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Xóa tìm kiếm
                </Button>
              </div>
            </div>
          ) : (
            <div className="search-state">
              <i className="bi bi-search search-state-icon"></i>
              <h2 className="search-state-title">Bạn muốn tìm phim gì?</h2>
              <p className="search-state-message">
                Nhập từ khóa vào ô tìm kiếm để khám phá kho tàng phim hấp dẫn
              </p>
              <Button 
                variant="danger"
                className="search-state-button"
                onClick={() => document.querySelector('.search-input')?.focus()}
              >
                <i className="bi bi-search me-1"></i>
                Bắt đầu tìm kiếm
              </Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default TimKiem;
