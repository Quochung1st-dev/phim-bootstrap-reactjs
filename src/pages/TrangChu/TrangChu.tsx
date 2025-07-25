import React from "react";
import { Container } from 'react-bootstrap';
import './TrangChu.css';

export const TrangChu: React.FC = () => {
    // Sample data - in a real app, this would come from an API
    const featuredMovies = [
        { id: 1, title: 'Phim Hành Động 1', image: 'https://via.placeholder.com/300x450?text=Phim+1', category: 'Hành Động' },
        { id: 2, title: 'Phim Tình Cảm 1', image: 'https://via.placeholder.com/300x450?text=Phim+2', category: 'Tình Cảm' },
        { id: 3, title: 'Phim Hài Hước 1', image: 'https://via.placeholder.com/300x450?text=Phim+3', category: 'Hài Hước' },
        { id: 4, title: 'Phim Kinh Dị 1', image: 'https://via.placeholder.com/300x450?text=Phim+4', category: 'Kinh Dị' },
        { id: 5, title: 'Phim Hành Động 2', image: 'https://via.placeholder.com/300x450?text=Phim+5', category: 'Hành Động' },
        { id: 6, title: 'Phim Tình Cảm 2', image: 'https://via.placeholder.com/300x450?text=Phim+6', category: 'Tình Cảm' },
        { id: 7, title: 'Phim Hài Hước 2', image: 'https://via.placeholder.com/300x450?text=Phim+7', category: 'Hài Hước' },
        { id: 8, title: 'Phim Kinh Dị 2', image: 'https://via.placeholder.com/300x450?text=Phim+8', category: 'Kinh Dị' },
        { id: 9, title: 'Phim Hành Động 3', image: 'https://via.placeholder.com/300x450?text=Phim+9', category: 'Hành Động' },
        { id: 10, title: 'Phim Tình Cảm 3', image: 'https://via.placeholder.com/300x450?text=Phim+10', category: 'Tình Cảm' },
        { id: 11, title: 'Phim Hài Hước 3', image: 'https://via.placeholder.com/300x450?text=Phim+11', category: 'Hài Hước' },
        { id: 12, title: 'Phim Kinh Dị 3', image: 'https://via.placeholder.com/300x450?text=Phim+12', category: 'Kinh Dị' },
        { id: 13, title: 'Phim Hành Động 4', image: 'https://via.placeholder.com/300x450?text=Phim+13', category: 'Hành Động' },
        { id: 14, title: 'Phim Tình Cảm 4', image: 'https://via.placeholder.com/300x450?text=Phim+14', category: 'Tình Cảm' },
        { id: 15, title: 'Phim Hài Hước 4', image: 'https://via.placeholder.com/300x450?text=Phim+15', category: 'Hài Hước' },
        { id: 16, title: 'Phim Kinh Dị 4', image: 'https://via.placeholder.com/300x450?text=Phim+16', category: 'Kinh Dị' },
        { id: 17, title: 'Phim Hành Động 5', image: 'https://via.placeholder.com/300x450?text=Phim+17', category: 'Hành Động' },
        { id: 18, title: 'Phim Tình Cảm 5', image: 'https://via.placeholder.com/300x450?text=Phim+18', category: 'Tình Cảm' },
        { id: 19, title: 'Phim Hài Hước 5', image: 'https://via.placeholder.com/300x450?text=Phim+19', category: 'Hài Hước' },
        { id: 20, title: 'Phim Kinh Dị 5', image: 'https://via.placeholder.com/300x450?text=Phim+20', category: 'Kinh Dị' },
    ];

    return (
        <>
            <div className="trang-chu-section-1">
                <div className="mt-4 mb-5">
                    <h2 className="section-title mb-4">Phim Đề Xuất</h2>
                    <div className="movie-grid">
                        {featuredMovies.map((movie) => (
                            <div key={movie.id} className="movie-item">
                                <div className="movie-card">
                                    <img src={movie.image} alt={movie.title} className="movie-poster" />
                                    <div className="movie-info">
                                        <h5 className="movie-title">{movie.title}</h5>
                                        <span className="movie-category">{movie.category}</span>
                                        <div className="movie-actions">
                                            <button className="btn btn-sm btn-danger">Xem ngay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TrangChu;