import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import '../style/style.css'; // Import CSS file
import '../style/home.css'; // Import CSS file
const APT_ROOT = import.meta.env.VITE_API_ROOT;

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 for email, 2 for OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile device once
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsMobile(/iphone|ipad|ipod|android/.test(userAgent));
    };
    checkMobile();
  }, []);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (loading) return; // ป้องกันการส่งฟอร์มซ้ำ
    
    setLoading(true);
    setError('');

    try {
      await axios.post(`${APT_ROOT}/api/auth/forgot-password`, { email });
      setStep(2); // Move to OTP verification step
    } catch (err) {
      if (err.response) {
        // Handle different error status codes
        switch (err.response.status) {
          case 400:
            setError(`Invalid request: ${err.response.data.message}`);
            break;
          case 404:
            setError('Email not found in our system');
            break;
          case 429:
            setError('Too many attempts. Please try again later');
            break;
          case 500:
            setError('Server error. Please try again later');
            break;
          default:
            setError(err.response.data.message || 'An unexpected error occurred');
        }
      } else if (err.request) {
        setError('Network error. Please check your internet connection');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (loading) return; // ป้องกันการส่งฟอร์มซ้ำ
    
    setLoading(true);
    setError('');
    setPasswordError('');

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${APT_ROOT}/api/auth/verify-otp`, {
        email,
        otp_code: otpCode,
        new_password: newPassword,
      });
      
      // Use a flag to handle redirection once to prevent recursion
      localStorage.setItem('passwordReset', 'true');
      
      // Redirect to login page after successful verification
      window.location.href = '/un2'; // Redirect to home page
    } catch (err) {
      if (err.response) {
        // Handle different error status codes
        switch (err.response.status) {
          case 400:
            setError(`Verification failed: ${err.response.data.message}`);
            break;
          case 401:
            setError('Invalid or expired OTP code');
            break;
          case 404:
            setError('Email not found');
            break;
          case 429:
            setError('Too many attempts. Please try again later');
            break;
          case 500:
            setError('Server error. Please try again later');
            break;
          default:
            setError(err.response.data.message || 'An unexpected error occurred');
        }
      } else if (err.request) {
        setError('Network error. Please check your internet connection');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // For mobile devices, adjust the UI to be more compact
  const containerClass = isMobile 
    ? "min-h-screen flex items-center justify-center bg-gray-50 p-4" 
    : "min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8";

  return (
    <div className={containerClass}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {step === 1 ? 'Forgot Password' : 'Verify OTP'}
          </h2>
          <p className="mt-4 text-center text-sm text-gray-400">
            {step === 1 
              ? 'Enter your email address and we\'ll send you a reset link'
              : 'Enter the OTP sent to your email and your new password'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                type="email"
                required
                className="appearance-none  relative block w-full px-3 py-2 border-gray-300 placeholder-gray-500 border rounded-[8px]
                     focus:outline-none focus:border-[#C0CDFF] focus:ring-4 focus:ring-[#6C63FF]/15"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="sr-only">OTP Code</label>
                <input
                  id="otp"
                  type="text"
                  required
                  maxLength="6"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-password" className="sr-only">New Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength="6"
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="New Password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-20"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-20"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>
              {passwordError && (
                <div className="text-sm text-red-500">
                  {passwordError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? 'Verifying...' : 'Reset Password'}
            </button>
          </form>
        )}
        
        <div className="text-center mt-4">
          <a
            href="/un2"
            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
