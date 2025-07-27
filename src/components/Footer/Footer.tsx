import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer: React.FC = () => {
  
  return (
    <footer className="site-footer bg-dark text-light py-4">
      <Container>
        <Row>
          <Col md={12} className="text-center">
            <h5 className="text-danger mb-3">PHIM HAY</h5> {/* Logo */}
            <ul className="list-inline footer-links mb-3">
              <li className="list-inline-item"><a href="/">Trang Chủ</a></li>
              <li className="list-inline-item"><a href="/phim-moi">Phim Mới</a></li>
              <li className="list-inline-item"><a href="/phim-le">Phim Lẻ</a></li>
              <li className="list-inline-item"><a href="/phim-bo">Phim Bộ</a></li>
              <li className="list-inline-item"><a href="/the-loai/hanh-dong">Phim Hành Động</a></li>
              <li className="list-inline-item"><a href="/the-loai/tinh-cam">Phim Tình Cảm</a></li>
              <li className="list-inline-item"><a href="/the-loai/kinh-di">Phim Kinh Dị</a></li>
              <li className="list-inline-item"><a href="/the-loai/hoat-hinh">Phim Hoạt Hình</a></li>
              <li className="list-inline-item"><a href="#">Liên Hệ</a></li>
            </ul>
            <p className="mb-2">
              Website xem phim trực tuyến với đa dạng các thể loại phim, cập nhật liên tục các phim mới chất lượng cao.
            </p>
            <div className="social-links mb-3">
              <a href="#" className="me-3 text-light"><i className="bi bi-facebook"></i></a>
              <a href="#" className="me-3 text-light"><i className="bi bi-twitter"></i></a>
              <a href="#" className="me-3 text-light"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-light"><i className="bi bi-youtube"></i></a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
