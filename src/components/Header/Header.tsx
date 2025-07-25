import React, { useState, useEffect, useRef } from 'react';
import routePath from '../../routes/routePath';
import { Container, Navbar, Nav, NavDropdown, Form, Button, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import './Header.css';
import { phimService } from '../../services/api/phim.service';
import type { Phim } from '../../types/phim.types';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Phim[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Cập nhật từ khóa tìm kiếm từ URL vào ô tìm kiếm khi ở trang tìm kiếm
  useEffect(() => {
    // Chỉ kiểm tra khi đường dẫn là trang tìm kiếm
    if (location.pathname === '/tim-kiem') {
      const queryParam = searchParams.get('query');
      if (queryParam) {
        setSearchQuery(queryParam);
      }
    }
  }, [location.pathname, searchParams]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery && searchQuery.length >= 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await phimService.searchPhim({
        query: searchQuery.trim(),
        per_page: 5, // Limit results in the dropdown
      });
      
      if (response.data && response.data.items) {
        setSearchResults(response.data.items);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length >= 2) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowResults(false);
      // Điều hướng đến trang tìm kiếm với query parameter
      navigate(`/tim-kiem?query=${encodeURIComponent(searchQuery.trim())}`);
      // Close mobile menu if open
      const navbarToggler = document.querySelector('.navbar-toggler') as HTMLElement;
      const isExpanded = navbarToggler?.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        navbarToggler?.click();
      }
    }
  };
  
  return (
    <header className="site-header">
      <Navbar expand="lg" bg="dark" variant="dark" className="py-2">
        <Container>
          <Navbar.Brand as={Link} to={routePath.TRANGCHU} className="logo">
            <span className="text-danger fw-bold">PHIM</span>
            <span className="text-light">HAY</span>
          </Navbar.Brand>
          
          <div className="d-flex d-lg-none ms-auto me-2">
            <div className="search-container-mobile position-relative">
              <div className="search-toggle" onClick={() => setShowResults(!showResults)}>
                <i className="bi bi-search text-light"></i>
              </div>
            </div>
          </div>
          
          <Navbar.Toggle aria-controls="main-navbar" />
          
          <Navbar.Collapse id="main-navbar">
            {/* Search box in the middle */}
            <Nav className="mx-auto d-flex align-items-center">
              <div className="search-container position-relative" ref={searchContainerRef}>
                <Form className="search-form" onSubmit={handleSearchSubmit}>
                  <div className="search-input-container">
                    <i className="bi bi-search search-icon"></i>
                    <Form.Control
                      type="text"
                      placeholder="Tìm kiếm phim..."
                      className="search-input"
                      aria-label="Search"
                      onChange={handleSearchChange}
                      value={searchQuery}
                      onFocus={() => {
                        if (searchQuery.trim().length >= 2) {
                          setShowResults(true);
                        }
                      }}
                      autoComplete="off"
                    />
                    {searchQuery && (
                      <button 
                        type="button" 
                        className="search-clear-btn"
                        onClick={() => {
                          setSearchQuery('');
                          setShowResults(false);
                        }}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>
                </Form>
                
                {/* Search results dropdown */}
                {showResults && searchQuery.trim().length >= 2 && (
                  <div className="search-results-container">
                    {isLoading ? (
                      <div className="text-center p-3">
                        <Spinner animation="border" variant="light" size="sm" />
                      </div>
                    ) : (
                      <div className="search-results">
                        {searchResults.length > 0 ? (
                          <>
                            {searchResults.map(phim => (
                              <Link 
                                key={phim.id}
                                to={`/${phim.slug}`}
                                className="search-result-item"
                                onClick={() => setShowResults(false)}
                              >
                                {phim.hinh_anh_thumb && (
                                  <img 
                                    src={phim.hinh_anh_thumb}
                                    alt={phim.ten}
                                    className="search-result-thumb"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                )}
                                <div className="search-result-info">
                                  <h6>{phim.ten}</h6>
                                </div>
                              </Link>
                            ))}
                            <div className="search-view-all">
                              <Link to={`/tim-kiem?query=${encodeURIComponent(searchQuery)}`} onClick={() => setShowResults(false)}>
                                Xem tất cả kết quả
                              </Link>
                            </div>
                          </>
                        ) : (
                          <div className="p-3 text-center">
                            <p className="text-light mb-0">
                              <i className="bi bi-exclamation-circle me-2"></i>
                              Không tìm thấy phim "{searchQuery}"
                            </p>
                            <div className="search-view-all mt-2">
                              <Link to={`/tim-kiem?query=${encodeURIComponent(searchQuery)}`} onClick={() => setShowResults(false)}>
                                <i className="bi bi-search me-1"></i> Tìm kiếm nâng cao
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Nav>
            
            {/* Menu on the right */}
            <Nav className="ms-auto">
              <Nav.Link as={Link} to={routePath.TRANGCHU}>Trang Chủ</Nav.Link>
              <Nav.Link as={Link} to={routePath.PHIM_MOI}>Phim Mới</Nav.Link>
              <Nav.Link as={Link} to={routePath.THE_LOAI.LIST}>Thể loại</Nav.Link>
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
