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
          <h1 className="search-title">Tìm Kiếm Phim</h1>
          
          <Form onSubmit={handleSubmit} className="search-form">
            <Form.Group className="mb-0 search-input-group">
              <Form.Control
                type="text"
                placeholder="Nhập tên phim cần tìm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <Button 
                variant="danger" 
                type="submit"
                className="search-button"
                disabled={loading || !searchQuery.trim()}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-search"></i>
                )}
              </Button>
            </Form.Group>
          </Form>
        </div>

        <div className="search-results-container">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3 text-muted">Đang tìm kiếm phim...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5 error-container">
              <i className="bi bi-exclamation-triangle text-danger display-4"></i>
              <p className="mt-3">{error}</p>
              <Button 
                variant="outline-light" 
                onClick={() => handleSearch()}
                className="mt-2"
              >
                Thử lại
              </Button>
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className="search-results-info">
                <p>Tìm thấy {totalResults} kết quả cho "{searchQuery}"</p>
              </div>
              
              <Row>
                {movies.map((movie) => (
                  <Col key={movie.id} lg={3} md={4} sm={6} xs={12} className="mb-4">
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
                    />
                    
                    {getPaginationItems()}
                    
                    <Pagination.Next
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          ) : searchQuery ? (
            <div className="text-center py-5 empty-results">
              <i className="bi bi-search text-muted display-4"></i>
              <p className="mt-3">Không tìm thấy kết quả phù hợp cho "{searchQuery}"</p>
              <p className="text-muted">Hãy thử tìm kiếm với từ khóa khác</p>
              <Button 
                variant="outline-light" 
                onClick={() => navigate('/')}
                className="mt-2"
              >
                Về trang chủ
              </Button>
            </div>
          ) : (
            <div className="text-center py-5 search-prompt">
              <i className="bi bi-search text-muted display-4"></i>
              <p className="mt-3">Nhập từ khóa để tìm kiếm phim</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default TimKiem;
