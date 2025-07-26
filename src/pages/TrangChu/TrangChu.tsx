import React, { useEffect, useState } from "react";
import { Pagination, Container, Row } from 'react-bootstrap';
import './TrangChu.css';
import { phimService } from "../../services/api/phim.service";
import type { Phim } from "../../types/phim.types";
import MovieCard from "../../components/MovieCard/MovieCard";
import { useNavigate } from "react-router-dom";

export const TrangChu: React.FC = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Phim[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [perPage, setPerPage] = useState<number>(20);
    
    const handleMovieClick = (movie: Phim) => {
        navigate(`/${movie.slug}`);
    };
    
    // Fetch movies with pagination
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await phimService.getPhimMoiCapNhat({
                    page: currentPage,
                    per_page: perPage
                });
                
                if (response.data) {
                    setMovies(response.data.items);
                    setTotalPages(response.data.pagination.last_page);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchMovies();
    }, [currentPage, perPage]);
    
    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Scroll to top when changing page
        window.scrollTo(0, 0);
    };

    return (
        <>
            <Container className="px-3">
                <div className="trang-chu-section-1">
                <div className="mt-4 mb-5">
                    <div className="section-header">
                        <h2 className="section-title mb-4">Phim Mới Cập Nhật</h2>
                    </div>
                    
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-danger" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-light">Đang tải phim...</p>
                        </div>
                    ) : (
                    <Row xs={2} sm={3} md={4} lg={5} className="g-3">
                {movies.map((movie: Phim) => (
                  <div key={movie.id} className="movie-grid-item">
                    <MovieCard movie={movie} onClick={handleMovieClick} />
                  </div>
                ))}
                </Row>
                    )}
                    
                    {/* Pagination controls */}
                    {!loading && totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-4">
                            <Pagination size="lg" className="custom-pagination">
                                <Pagination.First 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(1)} 
                                />
                                <Pagination.Prev 
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                />
                                
                                {/* Show max 5 page numbers */}
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        // If 5 or fewer pages, show all pages
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        // If current page is near the beginning
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        // If current page is near the end
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        // If current page is in the middle
                                        pageNum = currentPage - 2 + i;
                                    }
                                    
                                    return (
                                        <Pagination.Item 
                                            key={pageNum} 
                                            active={pageNum === currentPage}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </Pagination.Item>
                                    );
                                })}
                                
                                <Pagination.Next 
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                />
                                <Pagination.Last 
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(totalPages)} 
                                />
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
            </Container>
        </>
    );
}

export default TrangChu;