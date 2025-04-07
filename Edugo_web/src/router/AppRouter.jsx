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
import AdminUserAdd from '../components/AdminUserAdd';
import ChangePassword from '../components/ChangePassword';
import EditUser from '../components/EditUser';
import Officialwebpage from '../components/Officialwebpage.jsx';

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
    
    // เพิ่มการตรวจสอบสถานะการยืนยัน (verify) สำหรับ provider
    if (decoded.role === 'provider' && profileData && profileData.profile) {
      const verifyStatus = profileData.profile.verify;
      
      if (verifyStatus === 'Waiting') {
        return {
          isValid: false,
          role: 'provider',
          status: "Active",
          verifyStatus: "Waiting",
          message: "Your account is waiting for approval. Please wait for admin verification."
        };
      } else if (verifyStatus === 'No') {
        return {
          isValid: false,
          role: 'provider',
          status: "Active",
          verifyStatus: "Rejected",
          message: "Your account verification was rejected. Please contact administrator for assistance."
        };
      }
    }
    
    return {
      isValid: hasValidRole,
      role: decoded.role,
      status: profileData?.profile.status || "Unknown",
      verifyStatus: profileData?.profile.verify || null
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
      
      // แสดงแจ้งเตือนตามสถานะต่างๆ
      if (!auth.isValid) {
        if (auth.status === "Suspended" && !hasAlerted) {
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
        } else if (auth.role === 'provider' && auth.verifyStatus === "Waiting" && !hasAlerted) {
          Swal.fire({
            title: 'Waiting for Approval',
            text: auth.message || 'Your account is waiting for approval. Please wait for admin verification.',
            icon: 'info',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
            customClass: {
              popup: 'animated fadeInDown'
            }
          });
          setHasAlerted(true);
          localStorage.removeItem('token');
        } else if (auth.role === 'provider' && auth.verifyStatus === "Rejected" && !hasAlerted) {
          Swal.fire({
            title: 'Verification Rejected',
            text: auth.message || 'Your account verification was rejected. Please contact administrator for assistance.',
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
            customClass: {
              popup: 'animated fadeInDown'
            }
          });
          setHasAlerted(true);
          localStorage.removeItem('token');
        } else if (!hasAlerted) {
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
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setAuthState({ ...auth, loading: false });
      
      // แสดงแจ้งเตือนตามสถานะต่างๆ
      if (!auth.isValid) {
        if (auth.status === "Suspended" && !hasAlerted) {
          Swal.fire({
            title: 'Account Suspended',
            text: auth.message || 'Your account has been suspended. Please contact administrator.',
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
          });
          localStorage.removeItem('token');
          setHasAlerted(true);
        } else if (auth.role === 'provider' && auth.verifyStatus === "Waiting" && !hasAlerted) {
          Swal.fire({
            title: 'Waiting for Approval',
            text: auth.message || 'Your account is waiting for approval. Please wait for admin verification.',
            icon: 'info',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
          });
          localStorage.removeItem('token');
          setHasAlerted(true);
        } else if (auth.role === 'provider' && auth.verifyStatus === "Rejected" && !hasAlerted) {
          Swal.fire({
            title: 'Verification Rejected',
            text: auth.message || 'Your account verification was rejected. Please contact administrator for assistance.',
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
          });
          localStorage.removeItem('token');
          setHasAlerted(true);
        }
      }
    };
    
    verifyAuth();
  }, [hasAlerted]);

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  return (authState.isValid && authState.status !== "Suspended" && (authState.role !== 'provider' || authState.verifyStatus === 'Yes')) 
    ? <Navigate to="/homepage" replace /> 
    : children;
};

// คอมโพเนนต์สำหรับเส้นทางที่เฉพาะ Provider เท่านั้นและต้องผ่านการยืนยัน
const ProviderOnlyRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isValid: null, loading: true });
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setAuthState({ ...auth, loading: false });
      
      if (auth.role === 'provider') {
        // เช็คสถานะการยืนยันของ provider
        if (auth.verifyStatus === "Waiting" && !hasAlerted) {
          Swal.fire({
            title: 'Waiting for Approval',
            text: 'Your provider account is waiting for approval. Please wait for admin verification.',
            icon: 'info',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
            customClass: { popup: 'animated fadeInDown' }
          });
          setHasAlerted(true);
        } else if (auth.verifyStatus === "No" && !hasAlerted) {
          Swal.fire({
            title: 'Verification Rejected',
            text: 'Your provider verification was rejected. Please contact administrator for assistance.',
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
            customClass: { popup: 'animated fadeInDown' }
          });
          setHasAlerted(true);
        }
      } else if (auth.status === "Suspended") {
        if (!hasAlerted) {
          Swal.fire({
            title: 'Account Suspended',
            text: auth.message || 'Your account has been suspended. Please contact administrator.',
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
          });
          localStorage.removeItem('token');
          setHasAlerted(true);
        }
      } else if (!auth.isValid || auth.role !== 'provider') {
        if (!hasAlerted) {
          Swal.fire({
            title: 'Access Denied',
            text: 'This page is only accessible to verified providers.',
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

  // ให้เข้าถึงได้เฉพาะ provider ที่มีสถานะ verify เป็น Yes เท่านั้น
  return (authState.isValid && authState.role === 'provider' && authState.status !== "Suspended" && authState.verifyStatus === 'Yes') 
    ? children 
    : <Navigate to="/homepage" replace />;
};

// New component for superadmin-only routes
const SuperAdminRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isValid: null, loading: true });
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setAuthState({ ...auth, loading: false });
      
      if (!auth.isValid || auth.role !== 'superadmin') {
        if (!hasAlerted) {
          Swal.fire({
            title: 'Access Denied',
            text: 'This page is only accessible to superadmins.',
            icon: 'error',
            confirmButtonText: 'OK',
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

  return (authState.isValid && authState.role === 'superadmin') 
    ? children 
    : <Navigate to="/homepage" replace />;
};

// เพิ่ม component ใหม่สำหรับเส้นทางที่ admin และ superadmin เข้าถึงได้
const AdminAndSuperadminRoute = ({ children }) => {
  const [authState, setAuthState] = useState({ isValid: null, loading: true });
  const [hasAlerted, setHasAlerted] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setAuthState({ ...auth, loading: false });
      
      if (!auth.isValid || !['admin', 'superadmin'].includes(auth.role)) {
        if (!hasAlerted) {
          Swal.fire({
            title: 'Access Denied',
            text: 'This page is only accessible to administrators.',
            icon: 'error',
            confirmButtonText: 'OK',
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

  return (authState.isValid && ['admin', 'superadmin'].includes(authState.role)) 
    ? children 
    : <Navigate to="/homepage" replace />;
};

// กำหนด base URL สำหรับการ routing
const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/Officialwebpage" replace />,
    },
    {
      path: '/un2',
      element: <Navigate to="/Officialwebpage" replace />,
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
      path: '/Officialwebpage',
      element: (
        <PublicRoute>
          <Officialwebpage />
        </PublicRoute>
      )
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
      path: '/admin/user/add',
      element: (
        <PrivateRoute>
          <SuperAdminRoute>
            <AdminUserAdd />
          </SuperAdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: '/admin/user/edit/:id',
      element: (
        <PrivateRoute>
          <AdminAndSuperadminRoute>
            <EditUser />
          </AdminAndSuperadminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: '/change-password',
      element: (
        <PrivateRoute>
          <ChangePassword />
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
