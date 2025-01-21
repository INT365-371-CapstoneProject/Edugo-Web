import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Detail from '../components/Detail';
import Add from '../components/Add';
import Homepage from '../components/Homepage';
import NotFound from '../components/NotFound';
import Login from '../components/Login';

// ฟังก์ชันตรวจสอบการเข้าสู่ระบบ
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
}

// คอมโพเนนต์สำหรับป้องกันเส้นทางส่วนตัว
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// คอมโพเนนต์สำหรับเส้นทางสาธารณะ
const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/homepage" replace />;
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
