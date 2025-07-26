import React from 'react';
import { Pagination } from 'react-bootstrap';
import './CustomPagination.css';

interface CustomPaginationProps {
  currentPage: number;            // Trang hiện tại
  totalPages: number;             // Tổng số trang
  onPageChange: (page: number) => void;  // Callback khi chuyển trang
  className?: string;             // CSS class bổ sung (optional)
  showFirstLast?: boolean;        // Hiển thị nút First/Last (mặc định là true)
}

/**
 * Component Pagination tùy chỉnh có thể tái sử dụng
 * Hiển thị 3 số trang đầu tiên và 3 số trang cuối cùng với dấu "..."
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
  showFirstLast = true
}) => {
  // Không hiển thị phân trang nếu chỉ có 1 trang
  if (totalPages <= 1) return null;

  // Tạo danh sách các mục phân trang
  const getPaginationItems = () => {
    const items = [];
    
    if (totalPages <= 7) {
      // Hiển thị tất cả các trang nếu tổng số trang ít hơn hoặc bằng 7
      for (let i = 1; i <= totalPages; i++) {
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
    } else {
      // Trường hợp 1: Trang hiện tại gần phần đầu
      if (currentPage < 7) {
        // Hiển thị các trang từ 1 đến currentPage + 3 (tối đa 7 trang)
        const endPage = Math.min(7, currentPage + 3);
        for (let i = 1; i <= endPage; i++) {
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
        
        // Thêm dấu ... nếu chưa hiển thị đến trang cuối cùng
        if (endPage < totalPages - 1) {
          items.push(
            <Pagination.Ellipsis 
              key="ellipsis-end" 
              onClick={() => onPageChange(Math.ceil((endPage + totalPages) / 2))} 
            />
          );
        }
        
        // Hiển thị trang cuối cùng
        if (endPage < totalPages) {
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
      }
      // Trường hợp 2: Trang hiện tại gần phần cuối
      else if (currentPage > totalPages - 6) {
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
        
        // Thêm dấu ... nếu cần
        if (currentPage > 7) {
          items.push(
            <Pagination.Ellipsis 
              key="ellipsis-start" 
              onClick={() => onPageChange(Math.ceil(currentPage / 2))} 
            />
          );
        }
        
        // Hiển thị các trang từ currentPage - 3 đến cuối
        const startPage = Math.max(2, currentPage - 3);
        for (let i = startPage; i <= totalPages; i++) {
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
      }
      // Trường hợp 3: Trang hiện tại nằm ở giữa
      else {
        // Hiển thị trang đầu tiên và thứ 2
        for (let i = 1; i <= 2; i++) {
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
        
        // Thêm dấu ... đầu tiên
        items.push(
          <Pagination.Ellipsis 
            key="ellipsis-start" 
            onClick={() => onPageChange(Math.ceil(currentPage / 2))} 
          />
        );
        
        // Hiển thị các trang xung quanh trang hiện tại
        const startMiddle = currentPage - 2;
        const endMiddle = currentPage + 2;
        
        for (let i = startMiddle; i <= endMiddle; i++) {
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
        
        // Thêm dấu ... cuối cùng
        items.push(
          <Pagination.Ellipsis 
            key="ellipsis-end" 
            onClick={() => onPageChange(Math.ceil((endMiddle + totalPages) / 2))} 
          />
        );
        
        // Hiển thị 2 trang cuối cùng
        for (let i = totalPages - 1; i <= totalPages; i++) {
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
      }
    }

    return items;
  };

  return (
    <div className={`custom-pagination-wrapper d-flex justify-content-center py-3 ${className}`}>
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
