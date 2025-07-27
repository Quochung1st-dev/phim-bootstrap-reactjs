import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Phim } from '../../types/phim.types';
import './MovieCard.css';

interface MovieCardProps {
  movie: Phim;
  onClick?: (movie: Phim) => void;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onClick,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  
  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    }
  };
  
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/${movie.slug}`} className="movie-card-link">
      <div className={`movie-card ${className}`} onClick={handleClick}>
        <img 
          src={!imageError ? (movie.hinh_anh || 'https://via.placeholder.com/270x400?text=No+Image') : 'https://via.placeholder.com/270x400?text=No+Image'} 
          alt={movie.ten} 
          className="movie-poster" 
          loading="lazy"
          onError={handleImageError}
        />
        <div className="movie-card-info">
          <p className="movie-card-title" title={movie.ten}>{movie.ten}</p>
          {movie.the_loai && movie.the_loai.length > 0 && (
            <div className="movie-card-tags">
              {movie.the_loai.slice(0, 2).map((tag, index) => (
                <span key={index} className="movie-card-tag">{tag.ten}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// Tối ưu với React.memo để tránh re-render không cần thiết
export default React.memo(MovieCard);
