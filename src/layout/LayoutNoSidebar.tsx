import React from 'react';
import { Outlet } from 'react-router-dom';
import MainLayoutNoMenu from '../layout/MainLayoutNoMenu';

const LayoutRoute: React.FC = () => {
  return (
    <MainLayoutNoMenu>
      <Outlet />
    </MainLayoutNoMenu>
  );
};

export default LayoutRoute;
