import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer bg-dark text-light py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="text-danger mb-3">PHIM HAY</h5>
            <p>
              Website xem phim trực tuyến với đa dạng các thể loại phim, cập nhật liên tục các phim mới chất lượng cao.
            </p>
            <div className="social-links">
              <a href="#" className="me-3"><i className="bi bi-facebook"></i></a>
              <a href="#" className="me-3"><i className="bi bi-twitter"></i></a>
              <a href="#" className="me-3"><i className="bi bi-instagram"></i></a>
              <a href="#"><i className="bi bi-youtube"></i></a>
            </div>
          </Col>
          
          <Col md={2} className="mb-4 mb-md-0">
            <h5 className="text-white mb-3">Liên Kết</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="/">Trang Chủ</a></li>
              <li><a href="/phim-moi">Phim Mới</a></li>
              <li><a href="/phim-le">Phim Lẻ</a></li>
              <li><a href="/phim-bo">Phim Bộ</a></li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-4 mb-md-0">
            <h5 className="text-white mb-3">Thể Loại Nổi Bật</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="/the-loai/hanh-dong">Phim Hành Động</a></li>
              <li><a href="/the-loai/tinh-cam">Phim Tình Cảm</a></li>
              <li><a href="/the-loai/kinh-di">Phim Kinh Dị</a></li>
              <li><a href="/the-loai/hoat-hinh">Phim Hoạt Hình</a></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5 className="text-white mb-3">Liên Hệ</h5>
            <ul className="list-unstyled contact-info">
              <li><i className="bi bi-geo-alt me-2"></i> Hà Nội, Việt Nam</li>
              <li><i className="bi bi-envelope me-2"></i> info@phimhay.vn</li>
              <li><i className="bi bi-telephone me-2"></i> (84) 123 456 789</li>
              <li><i className="bi bi-headset me-2"></i> Hỗ trợ: 24/7</li>
            </ul>
          </Col>
        </Row>
        
        <hr className="mt-4 mb-4 bg-secondary" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">&copy; {currentYear} PHIM HAY. Tất cả các quyền được bảo lưu.</p>
            <small className="d-block mt-1 text-muted">Đây chỉ là website mẫu được tạo ra cho mục đích học tập.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
