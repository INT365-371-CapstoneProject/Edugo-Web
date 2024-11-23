import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Detail from '../components/Detail';
import Add from '../components/Add';
import Homepage from '../components/Homepage';

// กำหนด base URL สำหรับการ routing
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/homepage" replace />,
    },
    {
      path: '/homepage',
      element: <Homepage />,
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
  ],
  {
    basename: import.meta.env.BASE_URL,  // ใช้ base URL จาก Vite
  }
);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
