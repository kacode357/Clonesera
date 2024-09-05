import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNoMenu from '../components/HeaderNoMenu';
import Footer from '../components/Footer';
import { Layout } from 'antd';
import { CartProvider } from '../consts/CartContext';

const { Content } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setRole(parsedData.role);
    }
  }, []);

  useEffect(() => {
    if (role === 'admin') {
      navigate('/dashboard-admin');
    }
  }, [role, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [role]); // Cuộn lên đầu trang khi role thay đổi

  return (
    <CartProvider>
      <Layout className="overflow-hidden flex flex-col">
        <HeaderNoMenu />
        <Content className="transition-all duration-300 overflow-auto ml-0">
          <div className="flex flex-col min-h-screen">
            <div className="flex-1 pt-16 mt-4 p-4 overflow-auto">
              {children}
            </div>
            <Footer />
          </div>
        </Content>
      </Layout>
    </CartProvider>
  );
};

export default MainLayout;
