import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, Calendar, Globe, Tag } from 'lucide-react';
import img_edugo from '../assets/edugologo.svg';
import defaultAvatar from '../assets/default-avatar.png';
import '../style/navstyle.css';
import { getAvatar, getProfile } from '../composable/getProfile';
import axios from 'axios';
import debounce from 'lodash/debounce';

const APT_ROOT = import.meta.env.VITE_API_ROOT;
const urlSearch = `${APT_ROOT}/api/search/announce`;

function Nav() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userData, setUserData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfile();
        setUserData(profileData.profile);

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

  const handleSearch = async (e) => {
    e.preventDefault();
    
    const params = {
      search: searchQuery,
    };

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: params
      };

      console.log('Search URL:', urlSearch); // Debug log
      console.log('Config:', config); // Debug log
      
      const { data } = await axios.get(urlSearch, config);
      console.log('Search response:', data); // Debug log

      navigate({
        pathname: '/search',
        search: `?${new URLSearchParams(params).toString()}`
      });
    } catch (error) {
      console.error('Search failed:', error.response?.data || error.message);
      console.error('Full error:', error); // Debug log
    }
  };

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: { search: query }
        };

        const { data } = await axios.get(urlSearch, config);
        setSearchResults(data.data || []);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  // Update search handler for input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);
    setSelectedIndex(-1);
    debouncedSearch(query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Always prevent form submission
      if (searchResults.length > 0) {
        navigate(`/detail/${searchResults[0].id}`);
      }
      // Do nothing if there are no results
    }
  };

  // Add keyboard navigation handler
  const handleKeyDown = (e) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          navigate(`/detail/${searchResults[selectedIndex].id}`);
        } else if (searchResults.length > 0) {
          navigate(`/detail/${searchResults[0].id}`);
        }
        break;
      default:
        break;
    }
  };

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
      <div className="flex-1 px-8 relative">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl p-2.5 transition-all duration-300 hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <Search className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                placeholder="Search For Scholarship"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Search Results Dropdown */}
            {searchQuery && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg border border-gray-200 rounded-xl max-h-[400px] overflow-y-auto z-50">
                {searchResults.map((result, index) => (
                  <Link
                    key={result.id}
                    to={`/detail/${result.id}`}
                    className={`block p-3 transition-colors duration-200 ${
                      index === selectedIndex 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-medium">{result.title}</h3>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </form>
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


