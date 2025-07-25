import React from 'react';
import { Outlet } from 'react-router-dom';


type PublicLayoutProps = {
  children?: React.ReactNode;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="public-layout">
      {/* //   <Header /> */}
      <main>
        {children || <Outlet />}
      </main>
      {/* //   <Footer /> */}
    </div>
  );
};

export default PublicLayout;
