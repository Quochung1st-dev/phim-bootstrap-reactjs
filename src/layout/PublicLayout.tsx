import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import PageTransition from '../components/PageTransition';
import { useScrollToTop } from '../utils/scrollToTop';
import './PublicLayout.css';

type PublicLayoutProps = {
  children?: React.ReactNode;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  // Sử dụng location để đặt key cho PageTransition, giúp nó nhận biết thay đổi route
  const location = useLocation();
  
  // Sử dụng hook scroll to top
  useScrollToTop();
  
  return (
    <>
      <Header />
      <main>
        <PageTransition 
          type="fade" 
          duration={0.4}
          key={location.pathname}
        >
          {children || <Outlet />}
        </PageTransition>
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
