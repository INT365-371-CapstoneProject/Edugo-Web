import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="navbar-shadow">
      
       {/* โลโก้ด้านซ้าย */}
       <div className="flex items-center justify-start space-x-5">
            <Link to="/">
              <img src={img_edugo} alt="" style={{ height: "38px" }} />
            </Link>
        </div>

        <div className="w-2/3">
          <div className="form-control ml-10">
            <input type="text" placeholder="Scholarship Management" className="input input-bordered w-24 md:w-auto" />
          </div>
        </div>

        <div className='w-1/3 flex flex-row'>
          <div className="dropdown dropdown-end ml-10">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Profile"
                  src={avatarUrl || defaultAvatar}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultAvatar;
                  }}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li>
                <a className="justify-between" onClick={handleProfile}>
                  Profile
                </a>
              </li>
              <li><a onClick={handleLogout}>Logout</a></li>
            </ul>
          </div>
          <div className='font-bold ml-3 my-auto'>
            <h1>
              {userData.company_name || 
                (userData.first_name && userData.last_name 
                  ? `${userData.first_name} ${userData.last_name}`
                  : userData.username)}
            </h1>
          </div>
        </div>
      </div>
  )
}

export default Nav


