import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import './PublicLayout.css';

type PublicLayoutProps = {
  children?: React.ReactNode;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        {children || <Outlet />}
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
