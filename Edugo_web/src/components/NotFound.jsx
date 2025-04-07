import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import error404 from '../assets/error404.png'
import '../style/404Error.css'; // Import CSS file

function NotFound() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าเป็น Mobile device หรือไม่
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileDevice = /iphone|ipad|ipod|android/.test(userAgent);
      setIsMobile(mobileDevice);
    };
    
    checkDevice();
    
    // Add listener for orientation change which can trigger stack overflow on some mobile devices
    const handleOrientationChange = () => {
      // Simple flag to prevent excessive state updates
      setTimeout(checkDevice, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return (
    <>
      <div className={`Background ${isMobile ? 'mobile-background' : ''}`}>
        <img src={error404} alt="" className="picture" />
        <p className="errofont">We couldn't find the page 
        <span className='errorspan'>you were looking for..</span></p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Go Back Home
        </button>
      </div>
    </>
  );
}

export default NotFound;