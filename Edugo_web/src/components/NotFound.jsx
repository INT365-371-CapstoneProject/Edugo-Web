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
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Go Back Home
      </button>
    </div>
    </>
  );
}

export default NotFound;