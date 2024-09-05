import { useState, useEffect, useCallback } from 'react';

interface UserData {
  avatar: string;
}

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userDataString = localStorage.getItem('userData');

    if (token && userDataString) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(userDataString));
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
  }, []);

  return { isAuthenticated, userData, logout };
};

export default useAuth;
