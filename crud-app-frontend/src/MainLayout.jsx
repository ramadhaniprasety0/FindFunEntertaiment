import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarComponent from './components/NavbarFooterComponents/NavbarComponents';
import FooterComponent from './components/NavbarFooterComponents/FooterComponents';

const MainLayout = () => {
  return (
    <>
      <NavbarComponent />
      <Outlet />
      <FooterComponent />
    </>
  );
};

export default MainLayout;
