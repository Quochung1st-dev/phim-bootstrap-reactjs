import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import './PageTransition.css';

// Định nghĩa loại hiệu ứng có sẵn
export type TransitionType = 'fade' | 'slide' | 'scale' | 'flip' | 'none';

interface PageTransitionProps {
  children: ReactNode;
  type?: TransitionType;
  duration?: number;
  className?: string;
  isVisible?: boolean; // Điều khiển hiển thị/ẩn component
  direction?: 'left' | 'right' | 'up' | 'down'; // Hướng chuyển động
  key?: string | number; // Key để React nhận diện component khi thay đổi
}

/**
 * Component PageTransition dùng để tạo hiệu ứng chuyển trang mượt mà
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  type = 'fade',
  duration = 0.5,
  className = '',
  isVisible = true,
  direction = 'left',
  key,
}) => {
  // Định nghĩa các biến thể animation theo loại
  const getVariants = (): Variants => {
    switch (type) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
          exit: { opacity: 0 }
        };
      case 'slide':
        const offset = 100;
        const directionOffset = {
          left: { x: offset },
          right: { x: -offset },
          up: { y: offset },
          down: { y: -offset }
        };
        return {
          hidden: { opacity: 0, ...directionOffset[direction] },
          visible: { opacity: 1, x: 0, y: 0 },
          exit: { opacity: 0, ...directionOffset[direction] }
        };
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8 }
        };
      case 'flip':
        return {
          hidden: { opacity: 0, rotateY: 90 },
          visible: { opacity: 1, rotateY: 0 },
          exit: { opacity: 0, rotateY: -90 }
        };
      case 'none':
      default:
        return {
          hidden: {},
          visible: {},
          exit: {}
        };
    }
  };

  const variants = getVariants();

  // Scroll to top when component mounts or when key changes
  useEffect(() => {
    if (isVisible) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [key, isVisible]);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={key}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={{ duration }}
          className={`page-transition ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageTransition;
