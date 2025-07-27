import React, { useState, useEffect } from 'react';
import { Container, Button, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import routePath from '../../routes/routePath';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import MovieCard from '../../components/MovieCard/MovieCard';
import LoadMoreButton from '../../components/LoadMoreButton/LoadMoreButton';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';
import './PhimLuuTru.css';

const PhimLuuTru: React.FC = () => {
  // States
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Phim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const itemsPerPage = 20; // Number of movies to load per page
  const [hasMore, setHasMore] = useState<boolean>(true); // To control "Load More" button visibility
  
  // Fetch phim lưu trữ
  useEffect(() => {
    const fetchPhimLuuTru = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const storedMovieIds = phimService.getPhimLuuTruIds();
        if (storedMovieIds.length === 0) {
          setMovies([]);
          setTotalResults(0);
          setLoading(false);
          setHasMore(false);
          return;
        }

        const response = await phimService.getPhimListDanhSach({ 
          array_id: storedMovieIds,
          page: currentPage,
          per_page: itemsPerPage
        });
        
        if (response.data && response.data.items) {
          // Append new movies if loading more, otherwise replace
          setMovies(prevMovies => currentPage === 1 ? (response.data?.items || []) : [...prevMovies, ...(response.data?.items || [])]);
          setTotalResults(response.data.pagination?.total || 0);
          setHasMore((response.data.pagination?.current_page || 0) < (response.data.pagination?.last_page || 0));
          
          // Update document title
          document.title = 'Phim Đã Lưu Trữ | Phim Hay';
        } else {
          setError('Không thể tải danh sách phim đã lưu trữ');
        }
      } catch (err) {
        console.error('Failed to fetch archived movies:', err);
        setError('Đã có lỗi xảy ra khi tải danh sách phim đã lưu trữ');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhimLuuTru();
  }, [currentPage]);
  
  // Handle "Load More" button click
  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };
  
  return (
    <>
      <Container>
        <CustomBreadcrumb
        items={[
          { label: 'Trang chủ', path: '/', icon: 'bi-house-door' },
          { label: 'Phim đã lưu trữ', path: routePath.PHIM_LUU_TRU }
        ]}
      />
      </Container>
    
    <div className="phim-luu-tru-page">
      <Container>
        {/* Khu vực hiển thị danh sách phim đã lưu trữ */}
        <div>
          {loading && movies.length === 0 ? ( // Only show loading spinner if no movies are loaded yet
            <div className="text-center my-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3">Đang tải danh sách phim đã lưu trữ...</p>
            </div>
          ) : error ? (
            <div className="text-center my-5">
              <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
              <h2 className="mt-3">Đã xảy ra lỗi</h2>
              <p>{error}</p>
              <Button 
                variant="danger" 
                onClick={() => setCurrentPage(1)} // Reset to first page
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Thử lại
              </Button>
            </div>
          ) : movies.length > 0 ? (
            <>
              <p className="text-center mb-4">
                Tổng cộng <strong>{totalResults}</strong> phim đã lưu trữ
              </p>
              
              <Row xs={2} sm={3} md={3} lg={4} className="g-3">
                {movies.map((movie: Phim) => (
                  <div key={movie.id} className="movie-grid-item">
                    <MovieCard movie={movie} />
                  </div>
                ))}
                </Row>
              
              {/* Nút tải thêm */}
              {hasMore && (
                <div className="text-center my-4">
                  <LoadMoreButton 
                    onClick={handleLoadMore}
                    isLoading={loading}
                    hasMore={hasMore}
                    loadingText="Đang tải..."
                    buttonText="Tải thêm"
                    variant="danger"
                    icon="bi-arrow-clockwise"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center my-5">
              <i className="bi bi-film fs-1"></i>
              <h2 className="mt-3">Không có phim đã lưu trữ</h2>
              <p>
                Hiện tại chưa có phim nào được lưu trữ.
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

export default PhimLuuTru;
