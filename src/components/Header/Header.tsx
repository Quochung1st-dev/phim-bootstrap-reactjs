import React from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <Navbar expand="lg" bg="dark" variant="dark" className="py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="logo">
            <span className="text-danger fw-bold">PHIM</span>
            <span className="text-light">HAY</span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="main-navbar" />
          
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Trang Chủ</Nav.Link>
              <Nav.Link as={Link} to="/phim-moi">Phim Mới</Nav.Link>
              <NavDropdown title="Thể Loại" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/the-loai/hanh-dong">Hành Động</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/the-loai/tinh-cam">Tình Cảm</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/the-loai/hai-huoc">Hài Hước</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/the-loai/kinh-di">Kinh Dị</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/the-loai">Tất Cả Thể Loại</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Quốc Gia" id="country-nav-dropdown">
                <NavDropdown.Item as={Link} to="/quoc-gia/viet-nam">Việt Nam</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/quoc-gia/trung-quoc">Trung Quốc</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/quoc-gia/han-quoc">Hàn Quốc</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/quoc-gia/my">Mỹ</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/quoc-gia">Tất Cả Quốc Gia</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Tìm kiếm phim..."
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-danger">Tìm</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
