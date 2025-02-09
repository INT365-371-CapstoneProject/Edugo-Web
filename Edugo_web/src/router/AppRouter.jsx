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
import Profile from '../components/Profile';
// ฟังก์ชันตรวจสอบการเข้าสู่ระบบและบทบาท
const checkAuth = () => {
  const token = localStorage.getItem('token');
  const validRoles = ['provider', 'admin', 'superadmin'];
  
  if (!token) return { isValid: false };
  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    return { isValid: false };
  }

  try {
    const decoded = jwt_decode(token);
    const hasValidRole = decoded && decoded.role && validRoles.includes(decoded.role);
    return {
      isValid: hasValidRole,
      role: decoded.role
    };
  } catch (error) {
    console.error('Token decode error:', error);
    localStorage.removeItem('token');
    return { isValid: false };
  }
};

// คอมโพเนนต์สำหรับป้องกันเส้นทางส่วนตัว
const PrivateRoute = ({ children }) => {
  const auth = checkAuth();
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    if (!auth.isValid && !hasAlerted) {
      Swal.fire({
        title: 'Access Denied',
        text: 'Please log in to continue.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
      setHasAlerted(true);
    }
  }, [auth.isValid, hasAlerted]);

  return auth.isValid ? children : <Navigate to="/login" replace />;
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
      path: '/profile',
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
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
