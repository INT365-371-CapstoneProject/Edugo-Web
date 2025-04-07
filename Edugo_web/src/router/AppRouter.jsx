import React, { useEffect, useState, useContext, createContext } from 'react';
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

// ถ้ายังไม่ได้สร้าง context จริงๆ ให้สร้าง temporary context ง่ายๆ ก่อน
const AuthContext = createContext({
  auth: {
    isValid: false,
    role: null,
    status: null,
    verifyStatus: null,
    message: null
  }
});

// สร้างฟังก์ชันตรวจสอบสิทธิ์และ token ที่ปรับปรุงแล้ว
const checkAuth = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  
  try {
    // ตรวจสอบว่า token หมดอายุหรือไม่
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (payload.exp && payload.exp < now) {
      console.log("Token expired");
      localStorage.removeItem("token");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("token");
    return false;
  }
};

// ปรับปรุง PrivateRoute Component
const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setIsAuthenticated(auth);
      setIsLoading(false);
    };
    
    verifyAuth();
  }, []);

  if (isLoading) {
    // แสดง loading indicator ในระหว่างตรวจสอบ token
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// ปรับปรุง PublicRoute Component ให้ทำงานได้โดยไม่ต้องพึ่ง AuthContext
const PublicRoute = ({ children }) => {
  const [hasAlerted, setHasAlerted] = useState(false);
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded);
      
      // ตรวจสอบสถานะพิเศษของผู้ใช้
      if (decoded && !hasAlerted) {
        if (decoded.status === "Suspended") {
          Swal.fire({
            title: 'Account Suspended',
            text: 'Your account has been suspended. Please contact administrator.',
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
          });
          localStorage.removeItem('token');
          setHasAlerted(true);
        } else if (decoded.role === 'provider' && decoded.verifyStatus === "Waiting") {
          Swal.fire({
            title: 'Waiting for Approval',
            text: 'Your account is waiting for approval. Please wait for admin verification.',
            icon: 'info',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
          });
          localStorage.removeItem('token');
          setHasAlerted(true);
        } else if (decoded.role === 'provider' && decoded.verifyStatus === "Rejected") {
          Swal.fire({
            title: 'Verification Rejected',
            text: 'Your account verification was rejected. Please contact administrator for assistance.',
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#3085d6',
          });
          localStorage.removeItem('token');
          setHasAlerted(true);
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [hasAlerted]);
  
  return children;
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

// ปรับปรุง router configuration
const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <PrivateRoute>
          <Homepage />
        </PrivateRoute>
      ),
    },
    {
      path: "/un2",
      element: <Navigate to="/Officialwebpage" replace />,
    },
    {
      path: "/homepage",
      element: (
        <PrivateRoute>
          <Homepage />
        </PrivateRoute>
      )
    },
    {
      path: "/detail/:id",
      element: (
        <PrivateRoute>
          <Detail />
        </PrivateRoute>
      ),
    },
    {
      path: "/provider/detail/:id",
      element: (
        <PrivateRoute>
          <ProviderDetail />
        </PrivateRoute>
      ),
    },
    {
      path: "/add",
      element: (
        <PrivateRoute>
          <ProviderOnlyRoute>
            <Add />
          </ProviderOnlyRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/edit/:id",
      element: (
        <PrivateRoute>
          <ProviderOnlyRoute>
            <Add />
          </ProviderOnlyRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/Officialwebpage",
      element: (
        <PublicRoute>
          <Officialwebpage />
        </PublicRoute>
      )
    },
    {
      path: "/forgot-password",
      element: <ForgotPass />,
    },
    {
      path: "/profile",
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
    {
      path: "/admin/user/add",
      element: (
        <PrivateRoute>
          <SuperAdminRoute>
            <AdminUserAdd />
          </SuperAdminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/admin/user/edit/:id",
      element: (
        <PrivateRoute>
          <AdminAndSuperadminRoute>
            <EditUser />
          </AdminAndSuperadminRoute>
        </PrivateRoute>
      ),
    },
    {
      path: "/change-password",
      element: (
        <PrivateRoute>
          <ChangePassword />
        </PrivateRoute>
      ),
    },
    {
      path: "*",
      element: <NotFound />,
    }
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;
