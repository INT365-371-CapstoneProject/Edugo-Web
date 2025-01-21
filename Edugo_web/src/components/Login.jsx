import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import imageLogin from "../assets/login.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="hero min-h-screen bg-white font-['DM_Sans']">
      <div className="card flex-shrink-0 w-full max-w-4xl shadow-2xl bg-white border">
        <div className="hero-content flex-row gap-0 p-0">
          <div className="w-1/2 p-12">
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
                <a href="#" className="label-text-alt link link-hover text-[#64738B]">Forgot password?</a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary bg-[#355FFF] hover:bg-[#2347DD] text-white border-0">
                Login
              </button>
            </div>
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