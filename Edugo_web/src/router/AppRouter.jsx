import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode'; // เพิ่ม import jwt-decode
import Detail from '../components/Detail';
import Add from '../components/Add';
import Homepage from '../components/Homepage';
import NotFound from '../components/NotFound';
import Login from '../components/Login';
import { isTokenExpired } from '../utils/auth.js';
import ForgotPass from '../components/ForgotPass';

// ฟังก์ชันตรวจสอบการเข้าสู่ระบบและบทบาท
const checkAuth = () => {
  const token = localStorage.getItem('token');
  const validRoles = ['provider', 'admin', 'superadmin'];
  
  if (!token || isTokenExpired(token)) return { isValid: false };

  try {
    const decoded = jwt_decode(token);
    const hasValidRole = decoded && decoded.role && validRoles.includes(decoded.role);
    return {
      isValid: hasValidRole,
      role: decoded.role
    };
  } catch (error) {
    console.error('Token decode error:', error);
    return { isValid: false };
  }
};

// คอมโพเนนต์สำหรับป้องกันเส้นทางส่วนตัว
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const expired = token ? isTokenExpired(token) : false;
  const [hasAlerted, setHasAlerted] = useState(false);
  const auth = checkAuth();

  useEffect(() => {
    if (token && !auth.isValid && !hasAlerted) {
      Swal.fire({
        title: expired ? 'Session Expired' : 'Access Denied',
        text: expired ? 'Please log in again to continue.' : 
              'You do not have permission to access this page.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'animated fadeInDown'
        }
      }).then(() => {
        if (expired) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      });
      setHasAlerted(true);
    }
  }, [token, expired, hasAlerted, auth.isValid]);

  return auth.isValid ? children : null;
};

// คอมโพเนนต์สำหรับเส้นทางสาธารณะ
const PublicRoute = ({ children }) => {
  const auth = checkAuth();
  return auth.isValid ? <Navigate to="/homepage" replace /> : children;
};

// กำหนด base URL สำหรับการ routing
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: '/homepage',
      element: (
        <PrivateRoute>
          <Homepage />
        </PrivateRoute>
      )
    },
    {
      path: '/detail/:id',
      element: (
        <PrivateRoute>
          <Detail />
        </PrivateRoute>
      ),
    },
    {
      path: '/add',
      element: (
        <PrivateRoute>
          <Add />
        </PrivateRoute>
      ),
    },
    {
      path: '/edit/:id',
      element: (
        <PrivateRoute>
          <Add />
        </PrivateRoute>
      ),
    },
    {
      path: '/login',
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: '/forgot-password',
      element: <ForgotPass />,
    },
    {
      path: '*',
      element: <NotFound />, // ใช้ NotFound component
    }
  ],
  {
    basename: import.meta.env.BASE_URL,  // ใช้ base URL จาก Vite
  }
);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
