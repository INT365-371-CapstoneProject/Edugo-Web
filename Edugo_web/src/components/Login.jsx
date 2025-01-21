import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import imageLogin from "../assets/login.png";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    remember_me: false
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
    
    const inputValue = formData.email || formData.username;
    const inputError = validateInput(inputValue);
    if (inputError) {
      setError(inputError);
      return;
    }

    try {
      // Create payload with only the filled field (email or username)
      const payload = {
        ...(formData.email ? { email: formData.email } : { username: formData.username }),
        password: formData.password,
        remember_me: formData.remember_me
      };
      console.log(payload);
      const response = await axios.post(`${APT_ROOT}/api/login`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        // Redirect to homepage
        window.location.href = '/homepage';
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="hero min-h-screen bg-white font-['DM_Sans']">
      <div className="card flex-shrink-0 w-full max-w-4xl shadow-2xl bg-white border">
        <div className="hero-content flex-row gap-0 p-0">
          <div className="w-1/2 p-12">
            <form onSubmit={handleSubmit}>
              <div className="form-control text-left">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome</h2>
                <p className="text-sm text-gray-600 mb-6">Welcome to EDUGO! Discover valuable educational information and opportunities. Register for access to reliable scholarships and resources.</p>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-[18px] leading-[25px] text-black">Email/Username</span>
                </label>
                <input
                  type="text"
                  name="email_or_username"
                  value={formData.email || formData.username}
                  onChange={handleChange}
                  placeholder="Enter your email address or username"
                  className="input input-bordered bg-gray-200 focus:bg-gray-100 transition-colors"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-[18px] leading-[25px] text-black">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="input input-bordered bg-gray-200 focus:bg-gray-100 transition-colors w-full"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
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
                  <a href="#" className="label-text-alt link link-hover text-[#64738B]">
                    Forgot password?
                  </a>
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
              alt="Edugo Logo"
              className="w-72 h-auto drop-shadow-lg mx-8"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;