import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-700 mb-8">The page you are looking for does not exist.</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
      >
        Go Back Home
      </button>
    </div>
  );
}

export default NotFound;