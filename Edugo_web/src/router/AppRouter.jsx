import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Detail from '../components/Detail';
import Add from '../components/Add';
import Homepage from '../components/Homepage';
import NotFound from '../components/NotFound';
import Login from '../components/Login';
import { isTokenExpired } from '../utils/auth.js';
import ForgotPass from '../components/ForgotPass';
// ฟังก์ชันตรวจสอบการเข้าสู่ระบบ
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return token !== null && !isTokenExpired(token);
};

// คอมโพเนนต์สำหรับป้องกันเส้นทางส่วนตัว
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const expired = token ? isTokenExpired(token) : false;
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    if (token && expired && !hasAlerted) {
      Swal.fire({
        title: 'Session Expired',
        text: 'Please log in again to continue.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
      setHasAlerted(true);
      // ล้าง token ออกจาก localStorage
      localStorage.removeItem('token');
    }
  }, [token, expired, hasAlerted]);

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// คอมโพเนนต์สำหรับเส้นทางสาธารณะ
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/homepage" replace /> : children;
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
      element: <Detail />,
    },
    {
      path: '/add',
      element: <Add />,
    },
    {
      path: '/edit/:id',
      element: <Add />,
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
