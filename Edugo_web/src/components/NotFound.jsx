import React from 'react';
import { useNavigate } from 'react-router-dom';
import error404 from '../assets/404animated.gif'
import '../style/404Error.css'; // Import CSS file
import Nav from './Nav';


function NotFound() {
  const navigate = useNavigate();

  return (
    <>
        <div className="Background">
      <img src={error404} alt="" className="picture" />
      <p className="errofont">We couldn’t find the page you were looking for...</p>
      <button
        onClick={() => navigate('/')}
        className="myct-button"
      >
        Go Back Home
      </button>
    </div>
    </>
  );
}

export default NotFound;