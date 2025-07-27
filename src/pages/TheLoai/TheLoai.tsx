import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { theLoaiService } from '../../services/api/the_loai.service';
import type { TheLoai as TheLoaiType } from '../../types/the_loai.types';
import './TheLoai.css';
import CustomBreadcrumb from '../../components/CustomBreadcrumb';
import { routePath } from '../../routes/routePath';

const TheLoai: React.FC = () => {
  // States
  const [allTheLoai, setAllTheLoai] = useState<TheLoaiType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialItemsPerPage = 50; // Ban đầu hiện 50 thể loại
  const loadMoreCount = 20; // Mỗi lần load thêm 20 thể loại
  
  // Fetch thể loại info
  useEffect(() => {
    const fetchTheLoai = async () => {
      setLoading(true);
      setError(null);
      setAllTheLoai([]);
      
      try {
        // Lấy ban đầu 50 thể loại để hiển thị danh sách
        const params = {
          page: 1,
          per_page: initialItemsPerPage // Ban đầu lấy 50 thể loại
        };
        
        const allResponse = await theLoaiService.getDanhSachTheLoai(params);
        
        if (allResponse.data && allResponse.data.items) {
          setAllTheLoai(allResponse.data.items);
          
          // Kiểm tra xem có thể loại để load thêm không dựa vào thông tin phân trang
          if (allResponse.data.pagination) {
            // Sử dụng thông tin phân trang từ API để xác định có thêm dữ liệu hay không
            setHasMore(allResponse.data.pagination.current_page < allResponse.data.pagination.last_page);
          } else {
            setHasMore(false);
          }
          
          // Cập nhật tiêu đề trang
          document.title = 'Thể Loại Phim | Phim Hay';
        }
      } catch (err) {
        console.error('Failed to fetch genre list:', err);
        setError('Đã có lỗi xảy ra khi tải danh sách thể loại');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTheLoai();
  }, [initialItemsPerPage]);
  
  // Hàm để load thêm thể loại
  const loadMoreTheLoai = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const params = {
        page: nextPage,
        per_page: loadMoreCount // Tải thêm 20 thể loại
      };
      
      const response = await theLoaiService.getDanhSachTheLoai(params);
      
      if (response && response.data && response.data.items) {
        // Thêm vào danh sách thể loại hiện tại
        const newTheLoai = response.data.items;
        setAllTheLoai(prevTheLoai => [...prevTheLoai, ...newTheLoai]);
        setCurrentPage(nextPage);
        
        // Kiểm tra xem còn thể loại để load thêm không dựa vào thông tin phân trang
        if (response.data.pagination) {
          setHasMore(response.data.pagination.current_page < response.data.pagination.last_page);
        } else {
          setHasMore(false);
        }
        
        // Scroll một chút xuống dưới
        setTimeout(() => {
          window.scrollBy({
            top: 200,
            behavior: 'smooth'
          });
        }, 100);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more genres:', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };
  
  return (
    <>
    <Container>
    <CustomBreadcrumb
        items={[
          { label: 'Trang chủ', path: '/', icon: 'bi-house-door' },
          { label: 'Thể loại', path: routePath.THE_LOAI.LIST }
        ]}
      />
    </Container>
    <div className="the-loai-page">
      <Container>
        

        {/* Tiêu đề và danh sách các thể loại */}
        <div className="genre-header mb-4">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3">Đang tải danh sách thể loại...</p>
            </div>
          ) : error ? (
            <div className="text-center my-5">
              <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
              <h2 className="mt-3">Đã xảy ra lỗi</h2>
              <p>{error}</p>
            </div>
          ) : (
            <div className="genre-list mt-4">
              <Row xs={2} sm={3} md={4} lg={5} className="g-3">
                {allTheLoai.map(theLoai => (
                  <Col key={theLoai.id}>
                    <Link 
                      to={`/the-loai/${theLoai.slug}`} 
                      className="genre-badge-link"
                    >
                      <Badge 
                        className="genre-badge w-100 py-2 text-wrap" 
                        bg="secondary"
                        style={{ minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {theLoai.ten}
                      </Badge>
                    </Link>
                  </Col>
                ))}
              </Row>
              
              {/* Nút load thêm thể loại */}
              {hasMore && (
                <div className="text-center mt-4">
                  <Button 
                    variant="outline-primary" 
                    size="lg"
                    onClick={loadMoreTheLoai}
                    disabled={loadingMore}
                    className="load-more-btn"
                  >
                    {loadingMore ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang tải...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Xem Thêm
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </div>
    </>
  );
};

export default TheLoai;
