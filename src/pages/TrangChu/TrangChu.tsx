import React, { useEffect, useState } from "react";
import { Container, Row } from 'react-bootstrap';
import './TrangChu.css';
import { phimService } from "../../services/api/phim.service";
import { theLoaiService } from "../../services/api/the_loai.service";
import type { Phim } from "../../types/phim.types";
import type { TheLoai } from "../../types/the_loai.types";
import MovieCard from "../../components/MovieCard/MovieCard";
import { useNavigate, Link } from "react-router-dom";
import CustomPagination from "../../components/CustomPagination";

export const TrangChu: React.FC = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Phim[]>([]);
    const [randomCategories, setRandomCategories] = useState<TheLoai[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    
    const handleMovieClick = (movie: Phim) => {
        navigate(`/${movie.slug}`);
    };
    
    // Fetch movies with pagination
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const response = await phimService.getPhimNoiBat({
                    page: currentPage,
                    per_page: 20
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
    }, [currentPage]);
    
    // Fetch random categories
    useEffect(() => {
        const fetchRandomCategories = async () => {
            setCategoriesLoading(true);
            try {
                const response = await theLoaiService.getDanhSachTheLoaiRandom({
                    per_page: 40
                });
                
                if (response.data) {
                    setRandomCategories(response.data.items);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setCategoriesLoading(false);
            }
        };
        
        fetchRandomCategories();
    }, []);
    
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
                    {/* Phân trang */}
              {totalPages > 1 && (
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
                </div>
            </div>
            <div className="trang-chu-section-2">
                {categoriesLoading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="trang-chu-random-categories-container text-center">
                        <div className="trang-chu-random-categories">
                            {randomCategories.map(category => (
                                <Link 
                                    key={category.id} 
                                    to={`/the-loai/${category.slug}`}
                                    className="trang-chu-category-badge"
                                >
                                    {category.ten}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </Container>
        </>
    );
}

export default TrangChu;