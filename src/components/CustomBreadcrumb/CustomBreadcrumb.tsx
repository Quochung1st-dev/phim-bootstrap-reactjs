import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CustomBreadcrumb.css';

/**
 * Định nghĩa kiểu dữ liệu cho mục breadcrumb
 */
export interface BreadcrumbItem {
  label: string;       // Tên hiển thị
  path?: string;       // Đường dẫn (không có đường dẫn = active item)
  icon?: string;       // Class icon (optional)
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItem[];  // Mảng các mục breadcrumb
  className?: string;       // Class CSS bổ sung (optional)
}

/**
 * Component Breadcrumb tùy chỉnh có thể tái sử dụng
 * @example
 * const items = [
 *   { label: 'Trang chủ', path: '/', icon: 'bi-house' },
 *   { label: 'Phim mới', path: '/phim-moi' },
 *   { label: 'Tên phim' } // Item cuối cùng không có path = active
 * ];
 * <CustomBreadcrumb items={items} />
 */
const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({ items, className = '' }) => {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className={`custom-breadcrumb my-3 ${className}`}>
      {items.map((item, index) => (
        <Breadcrumb.Item
          key={index}
          linkAs={item.path ? Link : undefined}
          linkProps={item.path ? { to: item.path } : undefined}
          active={!item.path}
        >
          {item.icon && <i className={`${item.icon} me-1`}></i>}
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default CustomBreadcrumb;
