import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HeaderNoMenu from '../components/HeaderNoMenu';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import SidebarStudent from '../components/Sidebar/SidebarStudent';
import SidebarInstructor from '../components/Sidebar/SidebarInstructor';
import SidebarAdmin from '../components/Sidebar/SidebarAdmin';
import { Layout } from 'antd';
import { setGlobalLoadingHandler } from '../services/axiosInstance';
import { CartProvider } from '../consts/CartContext';
const { Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setRole(parsedData.role);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    setGlobalLoadingHandler(setIsLoading);
    if (location.pathname === '/home' && role === 'admin') {
      navigate('/admin/request-management');
    }
  }, [location.pathname, role, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const renderSidebar = useMemo(() => {
    if (location.pathname === '/home') {
      switch (role) {
        case 'student':
          return <SidebarStudent showMenu={showMenu} />;
        case 'instructor':
          return <SidebarInstructor showMenu={showMenu} />;
        case 'admin':
          navigate('/admin/request-management');
          return null;
        default:
          return null;
      }
    }

    switch (role) {
      case 'admin':
        return <SidebarAdmin showMenu={showMenu} />;
      case 'student':
        return <SidebarStudent showMenu={showMenu} />;
      case 'instructor':
        return <SidebarInstructor showMenu={showMenu} />;
      default:
        return null;
    }
  }, [location.pathname, role, showMenu, navigate]);

  return (
    <CartProvider>
      <Layout className="overflow-hidden h-screen flex flex-col">
        {isLoggedIn ? <Header toggleMenu={toggleMenu} /> : <HeaderNoMenu />}
        <Loading isLoading={isLoading}>
          {renderSidebar}
          <Content className={`transition-all duration-300 overflow-auto ${showMenu ? 'ml-56' : 'ml-0'}`}>
            <div className="flex flex-col min-h-screen">
              <div className="flex-1 pt-16 mt-4 p-4 overflow-auto">
                {children}
              </div>
              <Footer />
            </div>
          </Content>
        </Loading>
      </Layout>
    </CartProvider>
  );
};

export default MainLayout;

