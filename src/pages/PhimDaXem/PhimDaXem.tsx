import React, { useState, useEffect } from 'react';
import { Container, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';
import MovieCard from '../../components/MovieCard/MovieCard';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import LoadMoreButton from '../../components/LoadMoreButton/LoadMoreButton';
import routePath from '../../routes/routePath';
import './PhimDaXem.css';
import { toast } from 'react-toastify';

const PhimDaXem: React.FC = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Phim[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = import.meta.env.VITE_ITEM_PER_PAGE; // Number of movies to load per page
    const [hasMore, setHasMore] = useState<boolean>(true); // To control "Load More" button visibility

    useEffect(() => {
        // Set document title
        document.title = 'Phim Đã Xem | Phim Hay';

        const fetchPhimDaXem = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const storedMovieIds = phimService.getPhimDaXemIds();
                if (storedMovieIds.length === 0) {
                    setMovies([]);
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
                    setHasMore((response.data.pagination?.current_page || 0) < (response.data.pagination?.last_page || 0));
                } else {
                    setError('Không thể tải danh sách phim đã xem');
                }
            } catch (err) {
                console.error('Failed to fetch watched movies:', err);
                setError('Đã có lỗi xảy ra khi tải danh sách phim đã xem');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPhimDaXem();

        // Restore original title when component unmounts
        return () => {
            document.title = 'Phim Hay';
        };
    }, [currentPage]);



    const removeWatchedMovie = async (movieId: number) => {
        try {
            await phimService.removePhimDaXemLocalStorage(movieId);
            // Update state to remove the movie from the list
            setMovies(prev => prev.filter(movie => movie.id !== movieId));
            toast.success('Đã xóa phim khỏi danh sách phim đã xem');
        } catch (err) {
            console.error('Error removing watched movie:', err);
            toast.error('Có lỗi khi xóa phim khỏi danh sách đã xem');
        }
    };
    
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
                        { label: 'Phim đã xem', path: routePath.PHIM_DA_XEM }
                    ]}
                />
            </Container>

            <div className="phim-da-xem-page">
                <Container>

                    {/* Khu vực hiển thị danh sách phim đã xem */}
                    <div>
                        {loading && movies.length === 0 ? ( // Only show loading spinner if no movies are loaded yet
                            <div className="text-center my-5">
                                <div className="spinner-border text-danger" role="status">
                                    <span className="visually-hidden">Đang tải...</span>
                                </div>
                                <p className="mt-3">Đang tải danh sách phim đã xem...</p>
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
                                <Row xs={2} sm={3} md={3} lg={4} className="g-3">
                                    {movies.map((movie: Phim) => (
                                        <div key={movie.id} className="movie-grid-item">
                                            <div className="movie-card-container">
                                                <MovieCard movie={movie} />
                                                <Button 
                                                    variant="danger" 
                                                    size="sm"
                                                    className="remove-button"
                                                    onClick={() => removeWatchedMovie(movie.id)}
                                                >
                                                    <i className="bi bi-x"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </Row>
                                
                                {/* Nút tải thêm */}
                                {hasMore && (
                                    <div className="text-center my-4">
                                        <LoadMoreButton 
                                            onClick={handleLoadMore}
                                            isLoading={loading && currentPage > 1}
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
                            <div className="text-center py-5 empty-movies-container">
                                <div className="empty-state">
                                    <i className="bi bi-eye-slash display-1 text-muted mb-3"></i>
                                    <h2>Bạn chưa xem phim nào</h2>
                                    <p className="text-muted">Hãy khám phá và xem các phim của chúng tôi</p>
                                    <Button variant="outline-light" onClick={() => navigate('/')}>
                                        <i className="bi bi-house-door me-1"></i>
                                        Về trang chủ
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

export default PhimDaXem;
