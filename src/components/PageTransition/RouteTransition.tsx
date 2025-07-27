import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PageTransition from './PageTransition';
import type { TransitionType } from './PageTransition';

interface RouteTransitionProps {
  children: React.ReactNode;
  type?: TransitionType;
  duration?: number;
  className?: string;
}

/**
 * Component RouteTransition dùng với React Router để tạo hiệu ứng chuyển trang 
 * khi chuyển đổi giữa các routes
 */
const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  type = 'fade',
  duration = 0.5,
  className = '',
}) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  
  useEffect(() => {
    // Nếu location thay đổi
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage('fadeOut');
      
      // Đợi animation fadeOut hoàn tất rồi chuyển trang
      setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fadeIn');
      }, duration * 1000); // Chuyển đổi thời gian từ giây sang mili giây
    }
  }, [location, duration, displayLocation.pathname]);

  // Xác định trạng thái hiển thị dựa trên giai đoạn chuyển đổi
  const isVisible = transitionStage === 'fadeIn';

  return (
    <PageTransition
      type={type}
      duration={duration}
      className={className}
      isVisible={isVisible}
      key={displayLocation.pathname}
    >
      {children}
    </PageTransition>
  );
};

export default RouteTransition;
