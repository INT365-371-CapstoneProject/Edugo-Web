import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';
import img_edugo from '../assets/edugologo.svg';
import defaultAvatar from '../assets/default-avatar.png';
import '../style/navstyle.css';
import { getAvatar, getProfile } from '../composable/getProfile';

function Nav() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfile();
        setUserData(profileData.profile);
        console.log('Profile data:', profileData.profile);

        const imageUrl = await getAvatar();
        if (imageUrl) {
          setAvatarUrl(imageUrl);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setAvatarUrl(null);
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  }

  return (
    <div className="navbar-shadow sticky top-0 bg-white flex items-center h-16 border-b border-gray-200 z-50">
      {/* Logo section */}
      <div className="w-[200px]">
        <Link to="/">
          <img src={img_edugo} alt="Edugo Logo" className="h-10 w-auto" />
        </Link>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200"></div>

      {/* Search section */}
      <div className="flex-1 px-8">
        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl p-2.5 transition-all duration-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search For Scholarship"
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          <Menu className="text-gray-400 w-5 h-5 ml-2 cursor-pointer hover:text-blue-500" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200"></div>

      {/* Profile section */}
      <div className="w-[200px] flex justify-end items-center">
        <div className="dropdown dropdown-end">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost btn-circle avatar ring-2 ring-gray-200 hover:ring-blue-400 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img
                alt="Profile"
                src={avatarUrl || defaultAvatar}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultAvatar;
                }}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content z-[1] mt-3 p-2 shadow-lg bg-white rounded-xl w-60 border border-gray-100"
          >
            <li>
              <a 
                onClick={handleProfile}
                className="px-4 py-2 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-colors duration-200"
              >
                Profile
              </a>
            </li>
            <li>
              <a 
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg transition-colors duration-200"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
        <div className="font-medium text-gray-700 ml-3">
          <h1 className="truncate max-w-[200px]">
            {userData.company_name ||
              (userData.first_name && userData.last_name
                ? `${userData.first_name} ${userData.last_name}`
                : userData.username)}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Nav;


