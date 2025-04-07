import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isValid: false,
    role: null,
    username: null,
    status: null,
    verifyStatus: null,
    message: null,
    loading: true
  });

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setAuth({
          isValid: false,
          role: null,
          username: null,
          status: null,
          verifyStatus: null,
          message: 'No token found',
          loading: false
        });
        return;
      }

      try {
        // Try to decode the token
        const decoded = jwt_decode(token);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          setAuth({
            isValid: false,
            role: null,
            username: null,
            status: null,
            verifyStatus: null,
            message: 'Token expired',
            loading: false
          });
          return;
        }

        // Verify token with server
        const apiRoot = import.meta.env.VITE_API_ROOT;
        const response = await axios.get(`${apiRoot}/api/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data.success) {
          // Token is valid
          setAuth({
            isValid: true,
            role: decoded.role,
            username: decoded.username,
            status: response.data.status || 'Active',
            verifyStatus: response.data.verifyStatus,
            message: null,
            loading: false
          });
        } else {
          localStorage.removeItem('token');
          setAuth({
            isValid: false,
            role: null,
            username: null,
            status: null,
            verifyStatus: null,
            message: response.data.message || 'Invalid token',
            loading: false
          });
        }
      } catch (error) {
        console.error('Auth error:', error);
        
        // Handle specific error cases
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
        }
        
        // Set appropriate status based on the error
        const errorStatus = error.response?.data?.status;
        const errorMessage = error.response?.data?.message || 'Authentication failed';
        const verifyStatus = error.response?.data?.verifyStatus;
        
        setAuth({
          isValid: false,
          role: null,
          username: null,
          status: errorStatus,
          verifyStatus: verifyStatus,
          message: errorMessage,
          loading: false
        });
      }
    };

    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
