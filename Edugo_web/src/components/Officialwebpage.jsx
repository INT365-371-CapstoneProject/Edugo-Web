import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/OfficialStyle.css'; // Import CSS file
import Logo from '../assets/logo.png';
import Logocolor from '../assets/Edugocolor.png';


const Officialwebpage = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <div className="navbar">
        <div className="logo"><img src={Logo} alt="Logo" className="logo-img" /></div>
        <button className="login-btn" onClick={handleGoToLogin}>
          Log into Scholarship Management
        </button>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="text-container">
          <div className="logo"><img src={Logocolor} alt="Logo" className="logowhite-img" /></div>
          <p className="headline">Scholarship Management and Study Abroad Community Application</p>
          <p className="subtext">An all-in-one platform for streamlined scholarship management and a thriving community for students pursuing international education, offering resources, guidance, and networking</p>
          <button className="download-btn">Download Now (APK Version 1.0)</button>
        </div>
      </div>
    </div>
  );
};

export default Officialwebpage;
