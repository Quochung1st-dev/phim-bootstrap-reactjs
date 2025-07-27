import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook để tự động cuộn lên đầu trang khi điều hướng
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [pathname]);
  
  return null;
};
