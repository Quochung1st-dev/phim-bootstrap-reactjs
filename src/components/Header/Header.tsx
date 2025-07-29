import React, { useState, useEffect, useRef } from 'react';
import routePath from '../../routes/routePath';
import { Container, Navbar, Nav, Form, Spinner } from 'react-bootstrap';
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
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      
      if (mobileSearchContainerRef.current && !mobileSearchContainerRef.current.contains(event.target as Node)) {
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
        per_page: 10, // Limit results in the dropdown
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
          
          {/* Mobile search in the middle */}
          <div className="d-flex d-lg-none mobile-search-wrapper flex-grow-1 mx-2">
            <div className={`search-container-mobile position-relative w-100 ${showResults && searchQuery.trim().length >= 2 ? 'has-results' : ''}`} ref={mobileSearchContainerRef}>
              <Form className="mobile-search-form" onSubmit={handleSearchSubmit}>
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
              
              {/* Mobile search results dropdown */}
              {showResults && searchQuery.trim().length >= 2 && (
                <>
                <div className="mobile-search-overlay"></div>
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
                              onClick={() => {
                                setShowResults(false);
                              }}
                            >
                              <div className="search-result-info">
                                <h6>{phim.ten}</h6>
                              </div>
                            </Link>
                          ))}
                        </>
                      ) : (
                        <div className="p-3 text-center">
                          <p className="text-light mb-0">
                            <i className="bi bi-exclamation-circle me-2"></i>
                            Không tìm thấy phim "{searchQuery}"
                          </p>
                          <div className="search-view-all mt-2">
                            <Link 
                              to={`/tim-kiem?query=${encodeURIComponent(searchQuery)}`} 
                              onClick={() => {
                                setShowResults(false);
                              }}
                            >
                              <i className="bi bi-search me-1"></i> Tìm kiếm nâng cao
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </>
              )}
            </div>
          </div>
          
          <button 
            className="navbar-toggler custom-navbar-toggle" 
            type="button" 
            onClick={() => {
              document.body.classList.toggle('mobile-menu-open');
              const menuModal = document.getElementById('mobile-menu-modal');
              if (menuModal) {
                menuModal.classList.toggle('show');
              }
            }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* Custom Mobile Menu Modal */}
          <div 
            id="mobile-menu-modal" 
            className="mobile-menu-modal"
            onClick={(e) => {
              // Chỉ đóng menu khi click vào overlay (không phải vào menu container)
              if (e.target === e.currentTarget) {
                document.body.classList.remove('mobile-menu-open');
                const menuModal = document.getElementById('mobile-menu-modal');
                if (menuModal) {
                  menuModal.classList.remove('show');
                }
              }
            }}
          >
            <div className="mobile-menu-container"
              onClick={(e) => e.stopPropagation()} // Ngăn sự kiện click từ container lan ra ngoài overlay
            >
              <div className="mobile-menu-header">
                <div className="mobile-menu-brand">
                  <Link to={routePath.TRANGCHU} onClick={() => {
                    document.body.classList.remove('mobile-menu-open');
                    const menuModal = document.getElementById('mobile-menu-modal');
                    if (menuModal) {
                      menuModal.classList.remove('show');
                    }
                  }}>
                    <span className="text-danger fw-bold">PHIM</span>
                    <span className="text-light">HAY</span>
                  </Link>
                </div>
                <button 
                  type="button" 
                  className="mobile-menu-close" 
                  onClick={() => {
                    document.body.classList.remove('mobile-menu-open');
                    const menuModal = document.getElementById('mobile-menu-modal');
                    if (menuModal) {
                      menuModal.classList.remove('show');
                    }
                  }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              
              <div className="mobile-menu-content">
                <Nav className="menu-nav flex-column">
                  <Nav.Link 
                    as={Link} 
                    to={routePath.TRANGCHU} 
                    className="menu-item" 
                    style={{"--index": 0} as React.CSSProperties}
                    onClick={() => {
                      document.body.classList.remove('mobile-menu-open');
                      const menuModal = document.getElementById('mobile-menu-modal');
                      if (menuModal) {
                        menuModal.classList.remove('show');
                      }
                    }}
                  >
                    <i className="bi bi-house-door me-3"></i>Trang Chủ
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to={routePath.PHIM_MOI} 
                    className="menu-item" 
                    style={{"--index": 1} as React.CSSProperties}
                    onClick={() => {
                      document.body.classList.remove('mobile-menu-open');
                      const menuModal = document.getElementById('mobile-menu-modal');
                      if (menuModal) {
                        menuModal.classList.remove('show');
                      }
                    }}
                  >
                    <i className="bi bi-film me-3"></i>Phim Mới
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to={routePath.PHIM_XEM_NHIEU} 
                    className="menu-item" 
                    style={{"--index": 2} as React.CSSProperties}
                    onClick={() => {
                      document.body.classList.remove('mobile-menu-open');
                      const menuModal = document.getElementById('mobile-menu-modal');
                      if (menuModal) {
                        menuModal.classList.remove('show');
                      }
                    }}
                  >
                    <i className="bi bi-eye me-3"></i>Phim Xem Nhiều
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to={routePath.PHIM_HAY_NHAT} 
                    className="menu-item" 
                    style={{"--index": 3} as React.CSSProperties}
                    onClick={() => {
                      document.body.classList.remove('mobile-menu-open');
                      const menuModal = document.getElementById('mobile-menu-modal');
                      if (menuModal) {
                        menuModal.classList.remove('show');
                      }
                    }}
                  >
                    <i className="bi bi-star me-3"></i>Phim Hay Nhất
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to={routePath.PHIM_LUU_TRU} 
                    className="menu-item" 
                    style={{"--index": 4} as React.CSSProperties}
                    onClick={() => {
                      document.body.classList.remove('mobile-menu-open');
                      const menuModal = document.getElementById('mobile-menu-modal');
                      if (menuModal) {
                        menuModal.classList.remove('show');
                      }
                    }}
                  >
                    <i className="bi bi-archive me-3"></i>Phim Lưu Trữ
                  </Nav.Link>
                  <Nav.Link 
                    as={Link}
                    to={routePath.PHIM_DA_XEM}
                    className="menu-item"
                    style={{"--index": 5} as React.CSSProperties}
                    onClick={() => {
                      document.body.classList.remove('mobile-menu-open');
                      const menuModal = document.getElementById('mobile-menu-modal');
                      if (menuModal) {
                        menuModal.classList.remove('show');
                      }
                    }}
                  >
                    <i className="bi bi-eye me-3"></i>Phim Đã Xem
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to={routePath.THE_LOAI.LIST} 
                    className="menu-item" 
                    style={{"--index": 5} as React.CSSProperties}
                    onClick={() => {
                      document.body.classList.remove('mobile-menu-open');
                      const menuModal = document.getElementById('mobile-menu-modal');
                      if (menuModal) {
                        menuModal.classList.remove('show');
                      }
                    }}
                  >
                    <i className="bi bi-grid me-3"></i>Thể loại
                  </Nav.Link>
                </Nav>
              </div>
            </div>
          </div>
          
          <Navbar.Collapse id="main-navbar" className="d-none d-lg-block">
            
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
                                <div className="search-result-info">
                                  <h6>{phim.ten}</h6>
                                </div>
                              </Link>
                            ))}
                            <div className="search-view-all">
                              <Link 
                                to={`/tim-kiem?query=${encodeURIComponent(searchQuery)}`} 
                                onClick={() => setShowResults(false)}
                              >
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
                              <Link 
                                to={`/tim-kiem?query=${encodeURIComponent(searchQuery)}`} 
                                onClick={() => setShowResults(false)}
                              >
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
            <Nav className="ms-auto menu-nav">
              <Nav.Link as={Link} to={routePath.TRANGCHU} className="menu-item">Trang Chủ</Nav.Link>
              <Nav.Link as={Link} to={routePath.PHIM_MOI} className="menu-item">Phim Mới</Nav.Link>
              <Nav.Link as={Link} to={routePath.PHIM_XEM_NHIEU} className="menu-item">Phim Xem Nhiều</Nav.Link>
              <Nav.Link as={Link} to={routePath.PHIM_HAY_NHAT} className="menu-item">Phim Hay Nhất</Nav.Link>
              <Nav.Link as={Link} to={routePath.PHIM_LUU_TRU} className="menu-item">Phim Lưu Trữ</Nav.Link>
              <Nav.Link as={Link} to={routePath.PHIM_DA_XEM} className="menu-item">Phim Đã Xem</Nav.Link>
              <Nav.Link as={Link} to={routePath.THE_LOAI.LIST} className="menu-item">Thể loại</Nav.Link>
              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
