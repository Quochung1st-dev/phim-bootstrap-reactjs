import React from 'react';
import { Pagination } from 'react-bootstrap';
import './CustomPagination.css';

interface CustomPaginationProps {
  currentPage: number;            // Trang hiện tại
  totalPages: number;             // Tổng số trang
  onPageChange: (page: number) => void;  // Callback khi chuyển trang
  className?: string;             // CSS class bổ sung (optional)
  showFirstLast?: boolean;        // Hiển thị nút First/Last (mặc định là true)
  maxDisplayedPages?: number;     // Số trang tối đa hiển thị (mặc định là 5)
}

/**
 * Component Pagination tùy chỉnh có thể tái sử dụng
 * @example
 * <CustomPagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={handlePageChange}
 * />
 */
const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showFirstLast = true,
  maxDisplayedPages = 5
}) => {
  // Không hiển thị phân trang nếu chỉ có 1 trang
  if (totalPages <= 1) return null;

  // Tạo danh sách các mục phân trang
  const getPaginationItems = () => {
    const items = [];
    
    // Hiển thị trang đầu tiên
    items.push(
      <Pagination.Item
        key={1}
        active={currentPage === 1}
        onClick={() => onPageChange(1)}
      >
        1
      </Pagination.Item>
    );

    // Xác định khoảng trang hiển thị
    let startPage = Math.max(2, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxDisplayedPages - 3);
    
    // Điều chỉnh lại startPage nếu endPage đạt giới hạn
    if (endPage <= startPage) {
      startPage = Math.max(2, totalPages - maxDisplayedPages + 2);
      endPage = totalPages - 1;
    }
    
    // Thêm dấu ba chấm đầu
    if (startPage > 2) {
      items.push(<Pagination.Ellipsis key="ellipsis-start" />);
    }

    // Thêm các trang giữa
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={currentPage === i}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Thêm dấu ba chấm cuối
    if (endPage < totalPages - 1) {
      items.push(<Pagination.Ellipsis key="ellipsis-end" />);
    }

    // Thêm trang cuối cùng (nếu có nhiều hơn 1 trang)
    if (totalPages > 1) {
      items.push(
        <Pagination.Item
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className={`custom-pagination-wrapper d-flex justify-content-center mt-4 ${className}`}>
      <Pagination className="custom-pagination">
        {showFirstLast && (
          <Pagination.First 
            onClick={() => onPageChange(1)} 
            disabled={currentPage === 1}
          />
        )}
        
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        />
        
        {getPaginationItems()}
        
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        />
        
        {showFirstLast && (
          <Pagination.Last 
            onClick={() => onPageChange(totalPages)} 
            disabled={currentPage === totalPages}
          />
        )}
      </Pagination>
    </div>
  );
};

export default CustomPagination;
