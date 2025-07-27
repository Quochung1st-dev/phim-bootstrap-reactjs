import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import './LoadMoreButton.css';

interface LoadMoreButtonProps {
  onClick: () => void;
  isLoading: boolean;
  hasMore: boolean;
  loadingText?: string;
  buttonText?: string;
  variant?: string;
  size?: 'sm' | 'lg' | undefined;
  className?: string;
  noMoreText?: string;
  icon?: string;
}

/**
 * LoadMoreButton Component
 * 
 * A reusable button component for loading more content with AJAX-style functionality.
 * Shows loading state, handles disabling when loading or no more content is available,
 * and displays appropriate messages based on the current state.
 */
const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  onClick,
  isLoading,
  hasMore,
  loadingText = 'Đang tải...',
  buttonText = 'Tải thêm',
  variant = 'outline-primary',
  size = 'lg',
  className = '',
  noMoreText = 'Đã tải hết',
  icon = 'bi-plus-circle'
}) => {
  
  if (!hasMore) {
    return (
      <div className="load-more-button-wrapper no-more-content">
        <span className="no-more-text">
          <i className="bi bi-check-circle-fill me-2"></i>
          {noMoreText}
        </span>
      </div>
    );
  }

  return (
    <div className="load-more-button-wrapper">
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={isLoading}
        className={`load-more-button ${className}`}
      >
        {isLoading ? (
          <>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              className="me-2"
            />
            <span>{loadingText}</span>
          </>
        ) : (
          <>
            <i className={`bi ${icon} me-2`}></i>
            <span>{buttonText}</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
