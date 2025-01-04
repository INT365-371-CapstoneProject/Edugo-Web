import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="hero min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="hero-content flex-col lg:flex-row-reverse gap-8">
        <div className="text-center lg:text-left">
          <div className="flex justify-center lg:justify-start mb-6">
            <img 
              src="/edugo-logo.png" 
              alt="Edugo Logo" 
              className="w-64 h-auto drop-shadow-lg"
            />
          </div>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-white backdrop-blur-sm bg-opacity-90">
          <div className="card-body">
            <div className="form-control text-left">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome</h2>
                <p className="text-sm text-gray-600 mb-6">Discover educational opportunities and resources with EDUGO</p>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email/Username</span>
              </label>
              <input 
                type="text" 
                placeholder="Enter your username" 
                className="input input-bordered bg-gray-200 focus:bg-gray-100 transition-colors" 
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
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
              <label className="label justify-end">
                <a href="#" className="label-text-alt link link-hover text-blue-600">Forgot password?</a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0">
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;