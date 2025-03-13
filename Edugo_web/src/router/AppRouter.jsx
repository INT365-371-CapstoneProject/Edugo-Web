import React, { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jwt_decode from 'jwt-decode';
import Detail from '../components/Detail';
import Add from '../components/Add';
import Homepage from '../components/Homepage';
import NotFound from '../components/NotFound';
import Login from '../components/Login';
import ProviderDetail from '../components/ProviderDetail';
import { isTokenExpired } from '../utils/auth.js';
import ForgotPass from '../components/ForgotPass';
import Profile from '../components/Profile';
import { checkUserStatus } from '../composable/getProfile.js';

// ฟังก์ชันตรวจสอบการเข้าสู่ระบบ สถานะ และบทบาท
const checkAuth = async () => {
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
    
    // เพิ่มการตรวจสอบสถานะผู้ใช้จาก API โดยใช้ฟังก์ชัน checkUserStatus แทน
    const profileData = await checkUserStatus(token);

    // ตรวจสอบถ้าสถานะผู้ใช้เป็น "Suspended"
    if (profileData && profileData.profile.status === "Suspended") {
      return {
        isValid: false,
        role: decoded.role,
        status: "Suspended",
        message: "Your account has been suspended. Please contact administrator."
      };
    }
    
    return {
      isValid: hasValidRole,
      role: decoded.role,
      status: profileData?.profile.status || "Unknown"
    };
  } catch (error) {
    console.error('Token decode error:', error);
    localStorage.removeItem('token');
    return { isValid: false };
  }
};

// คอมโพเนนต์สำหรับป้องกันเส้นทางส่วนตัว
const PrivateRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isValid: null, loading: true });
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setAuthState({ ...auth, loading: false });
      
      // แสดงแจ้งเตือนเมื่อบัญชีถูกระงับ
      if (!auth.isValid && auth.status === "Suspended" && !hasAlerted) {
        Swal.fire({
          title: 'Account Suspended',
          text: auth.message || 'Your account has been suspended. Please contact administrator.',
          icon: 'error',
          confirmButtonText: 'Understood',
          confirmButtonColor: '#3085d6',
          customClass: {
            popup: 'animated fadeInDown'
          }
        });
        setHasAlerted(true);
        localStorage.removeItem('token');
      } else if (!auth.isValid && !hasAlerted) {
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
    };
    
    verifyAuth();
  }, [hasAlerted]);

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  return authState.isValid ? children : <Navigate to="/login" replace />;
};

// คอมโพเนนต์สำหรับเส้นทางสาธารณะ
const PublicRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isValid: null, loading: true });

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setAuthState({ ...auth, loading: false });
      
      // แสดงแจ้งเตือนเมื่อบัญชีถูกระงับแต่ยังมี token ใน localStorage
      if (auth.status === "Suspended") {
        Swal.fire({
          title: 'Account Suspended',
          text: auth.message || 'Your account has been suspended. Please contact administrator.',
          icon: 'error',
          confirmButtonText: 'Understood',
          confirmButtonColor: '#3085d6',
        });
        localStorage.removeItem('token');
      }
    };
    
    verifyAuth();
  }, []);

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  return (authState.isValid && authState.status !== "Suspended") ? <Navigate to="/homepage" replace /> : children;
};

// คอมโพเนนต์สำหรับเส้นทางที่เฉพาะ Provider เท่านั้น
const ProviderOnlyRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isValid: null, loading: true });
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setAuthState({ ...auth, loading: false });
      
      if (auth.status === "Suspended") {
        Swal.fire({
          title: 'Account Suspended',
          text: auth.message || 'Your account has been suspended. Please contact administrator.',
          icon: 'error',
          confirmButtonText: 'Understood',
          confirmButtonColor: '#3085d6',
        });
        localStorage.removeItem('token');
        return;
      }
      
      if (!auth.isValid || auth.role !== 'provider') {
        if (!hasAlerted) {
          Swal.fire({
            title: 'Access Denied',
            text: 'This page is only accessible to providers.',
            icon: 'error',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
            customClass: {
              popup: 'animated fadeInDown'
            }
          });
          setHasAlerted(true);
        }
      }
    };
    
    verifyAuth();
  }, [hasAlerted]);

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  return (authState.isValid && authState.role === 'provider' && authState.status !== "Suspended") 
    ? children 
    : <Navigate to="/homepage" replace />;
};

// กำหนด base URL สำหรับการ routing
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/login" replace />,
    },
    {
      path: '/un2',
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
      path: '/provider/detail/:id',
      element: (
        <PrivateRoute>
          <ProviderDetail />
        </PrivateRoute>
      ),
    },
    {
      path: '/add',
      element: (
        <PrivateRoute>
          <ProviderOnlyRoute>
            <Add />
          </ProviderOnlyRoute>
        </PrivateRoute>
      ),
    },
    {
      path: '/edit/:id',
      element: (
        <PrivateRoute>
          <ProviderOnlyRoute>
            <Add />
          </ProviderOnlyRoute>
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
      element: <NotFound />,
    }
  ],
  {
    basename: import.meta.env.BASE_URL,
  }
);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
