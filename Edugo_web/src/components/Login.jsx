import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import imageLogin from "../assets/login.png";
import Swal from 'sweetalert2';
import { useNavigate, Link } from "react-router-dom";
import '../style/style.css'; // Import CSS file
import jwt_decode from 'jwt-decode'; // Import jwt-decode
import { checkUserStatus } from "../composable/getProfile"; // นำเข้าฟังก์ชัน checkUserStatus
const APT_ROOT = import.meta.env.VITE_API_ROOT;

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    remember_me: false
  });
  const [inputErrors, setInputErrors] = useState({
    email_username: "",
    password: ""
  });
  const [error, setError] = useState("");

  const isEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'email_or_username') {
      // Clear both email and username first
      setFormData(prevState => ({
        ...prevState,
        email: '',
        username: '',
        // Then set the appropriate field based on input type
        [isEmail(value) ? 'email' : 'username']: value
      }));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const validateInput = (value) => {
    if (!value.trim()) {
      return "Email or username is required";
    }
    
    if (!isEmail(value) && value.length < 3) {
      return "Please enter a valid email or username (minimum 3 characters)";
    }
    
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setInputErrors({ email_username: "", password: "" });
    
    const inputValue = formData.email || formData.username;
    const inputError = validateInput(inputValue);
    
    let hasError = false;
    
    if (!formData.password) {
      setInputErrors(prev => ({
        ...prev,
        password: "Password is required"
      }));
      hasError = true;
    }

    if (inputError) {
      setInputErrors(prev => ({
        ...prev,
        email_username: inputError
      }));
      hasError = true;
    }

    if (hasError) return;

    try {
      const payload = {
        ...(formData.email ? { email: formData.email } : { username: formData.username }),
        password: formData.password,
        remember_me: formData.remember_me
      };
      
      const response = await axios.post(`${APT_ROOT}/api/login`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const token = response.data.token;
        
        // Decode token to check role
        const decoded = jwt_decode(token);
        const validRoles = ['provider', 'admin', 'superadmin'];
        
        if (!decoded.role || !validRoles.includes(decoded.role)) {
          Swal.fire({
            title: 'Access Denied',
            text: 'You do not have permission to access this system.',
            icon: 'error',
            confirmButtonColor: '#d33',
          });
          return;
        }

        // ตรวจสอบสถานะผู้ใช้ก่อนที่จะให้เข้าสู่ระบบ
        const profileData = await checkUserStatus(token);
        
        // Check for suspended account
        if (profileData && profileData.profile.status === "Suspended") {
          Swal.fire({
            title: 'Account Suspended',
            text: 'Your account has been suspended. Please contact administrator.',
            icon: 'error',
            confirmButtonText: 'Understood',
            confirmButtonColor: '#d33',
          });
          return;
        }
        
        // Check verification status for providers
        if (decoded.role === 'provider' && profileData && profileData.profile) {
          const verifyStatus = profileData.profile.verify;
          
          if (verifyStatus === 'Waiting') {
            Swal.fire({
              title: 'Waiting for Approval',
              text: 'Your account is waiting for approval. Please wait for admin verification.',
              icon: 'info',
              confirmButtonText: 'Understood',
              confirmButtonColor: '#3085d6',
            });
            return;
          } else if (verifyStatus === 'No') {
            Swal.fire({
              title: 'Verification Rejected',
              text: 'Your account verification was rejected. Please contact administrator for assistance.',
              icon: 'error',
              confirmButtonText: 'Understood',
              confirmButtonColor: '#d33',
            });
            return;
          }
        }

        // ถ้าผ่านการตรวจสอบทั้งหมด จึงบันทึก token และแสดงข้อความยินดีต้อนรับ
        localStorage.setItem('token', token);
        
        await Swal.fire({
          title: 'Welcome Back!',
          text: 'Login successful',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          backdrop: `
            rgba(0,0,123,0.2)
            left top
            no-repeat
          `,
          customClass: {
            popup: 'animate-custom-popup'
          },
          didOpen: (popup) => {
            popup.style.transition = 'all 0.3s ease-out';
            popup.style.transform = 'scale(1)';
            popup.style.opacity = '1';
          },
          willClose: (popup) => {
            popup.style.transform = 'scale(0.95)';
            popup.style.opacity = '0';
          }
        });
        
        window.location.href = '/un2'; // Redirect to home page
      }
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 400:
          case 401:
            setInputErrors({
              email_username: "error", // Just set a flag to show red border
              password: "Invalid email/username or password" // Only show message here
            });
            break;
          case 404:
            setInputErrors({
              email_username: "User not found"
            });
            break;
          case 429:
            setInputErrors({
              email_username: "Too many login attempts",
              password: "Please try again later"
            });
            break;
          default:
            setInputErrors({
              email_username: "Something went wrong",
              password: "Please try again"
            });
        }
      } else if (err.request) {
        setInputErrors({
          email_username: "Network error",
          password: "Please check your internet connection"
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden font-['DM_Sans'] Backgound">
      <div className="card flex-shrink-0 w-full max-w-5xl shadow-sm bg-white border">
        <div className="hero-content flex-row gap-0 p-0">
          <div className="w-1/2 p-12">
            <form onSubmit={handleSubmit}>
              <div className="form-control text-left">
                <h2 className="text-4xl font-normal text-gray-800 mb-4">Welcome back</h2>
                <p className="text-sm font-light text-gray-600 mb-6">Welcome back to EDUGO! Discover valuable educational information and opportunities. Register for access to reliable scholarships and resources.</p>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-[18px] leading-[25px] text-black font-normal">Email/Username</span>
                </label>
                <input
                  type="text"
                  name="email_or_username"
                  value={formData.email || formData.username}
                  onChange={handleChange}
                  placeholder="Enter your email address or username"
                  className={`input transition-colors border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-100
                    ${inputErrors.email_username 
                      ? 'bg-red-50 border-red-500 focus:border-red-500' 
                      : 'bg-gray-100 focus:bg-gray-100'}`}
                />
                {/* Only show message if it's not the combined error state */}
                {inputErrors.email_username && inputErrors.email_username !== "error" && (
                  <label className="label">
                    <span className="label-text-alt text-red-500">{inputErrors.email_username}</span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-[18px] leading-[25px] text-black mt-4 font-normal">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`input w-full transition-colors border rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-100
                      ${inputErrors.password 
                        ? 'bg-red-50 border-red-500 focus:border-red-500' 
                        : 'bg-gray-100 focus:bg-gray-100'}`}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {inputErrors.password && (
                  <label className="label">
                    <span className="label-text-alt text-red-500">{inputErrors.password}</span>
                  </label>
                )}
                <div className="flex items-center justify-between mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="remember_me"
                      checked={formData.remember_me}
                      onChange={handleChange}
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span className="label-text text-gray-600">Remember me</span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="label-text-alt link link-hover text-[#64738B] pt-12"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary bg-[#355FFF] hover:bg-[#2347DD] text-white border-0">
                  Login
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#EBEFFF] flex items-center justify-center mr-12 py-16 bordder rounded-lg">
            <img
              src={imageLogin}
              alt="Edugo Welcome"
              className="welcomelogin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;