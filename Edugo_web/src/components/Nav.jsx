import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, Calendar, Globe, ChevronRight } from 'lucide-react';
import img_edugo from '../assets/edugologo.svg';
import defaultAvatar from '../assets/default-avatar.png';
import '../style/navstyle.css';
import { getAvatar, getProfile } from '../composable/getProfile';
import { getCategory } from '../composable/getCategory';
import axios from 'axios';
import debounce from 'lodash/debounce';

const APT_ROOT = import.meta.env.VITE_API_ROOT;

function Nav() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [userData, setUserData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchEndpoint, setSearchEndpoint] = useState('announce-provider');
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [showMainDropdown, setShowMainDropdown] = useState(false);
  const mainDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const [educationLevels] = useState(['Undergraduate', 'Master', 'Doctorate']);
  const [selectedEducationLevels, setSelectedEducationLevels] = useState([]);
  const [showEducationDropdown, setShowEducationDropdown] = useState(false);
  const educationDropdownRef = useRef(null);
  const searchContainerRef = useRef(null);
  
  // Update overflow detection to be more precise
  useEffect(() => {
    const container = searchContainerRef.current;
    if (!container) return;

    const checkOverflow = () => {
      const hasOverflow = container.scrollHeight > container.clientHeight || 
                         container.scrollWidth > container.clientWidth;
      if (hasOverflow) {
        container.classList.add('has-scroll');
      } else {
        container.classList.remove('has-scroll');
      }
    };

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(container);

    // Initial check
    checkOverflow();

    // Check when tags change
    return () => observer.disconnect();
  }, [selectedCategories, selectedEducationLevels]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getProfile();
        setUserData(profileData.profile);
        
        // Set search endpoint based on user role
        if (profileData.profile.role === 'admin' || profileData.profile.role === 'superadmin') {
          setSearchEndpoint('announce-admin');
        }

        const imageUrl = await getAvatar();
        if (imageUrl) {
          setAvatarUrl(imageUrl);
        }

        const categoryData = await getCategory();

        setCategories(categoryData || []);
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

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add click outside handler for main dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (mainDropdownRef.current && !mainDropdownRef.current.contains(event.target)) {
        setShowMainDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    
    // Create search params object
    const params = new URLSearchParams();
    
    // Only add search param if there's a query
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }

    // Add category if selected
    if (selectedCategories.length > 0) {
      params.append('category', selectedCategories.join(','));
    }

    // Add education_level if selected
    if (selectedEducationLevels.length > 0) {
      params.append('education_level', selectedEducationLevels.join(','));
    }

    // Don't navigate if there are no search parameters
    if (params.toString() === '') {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: Object.fromEntries(params)
      };

      const searchUrl = `${APT_ROOT}/api/search/${searchEndpoint}`;
      const { data } = await axios.get(searchUrl, config);

      navigate({
        pathname: '/search',
        search: `?${params.toString()}`
      });
    } catch (error) {
      console.error('Search failed:', error.response?.data || error.message);
    }
  };

  // Create debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query, categories, educationLevels) => {
      if (!query.trim() && categories.length === 0 && educationLevels.length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        
        if (query.trim()) {
          params.append('search', query.trim());
        }
        if (categories.length > 0) {
          params.append('category', categories.join(','));
        }
        if (educationLevels.length > 0) {
          params.append('education_level', educationLevels.join(','));
        }

        const config = {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: Object.fromEntries(params)
        };

        const searchUrl = `${APT_ROOT}/api/search/${searchEndpoint}`;
        const { data } = await axios.get(searchUrl, config);
        setSearchResults(data.data || []);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    [searchEndpoint]
  );

  // Update search handler for input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setIsSearching(true);
    setSelectedIndex(-1);
    debouncedSearch(query, selectedCategories, selectedEducationLevels);
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
    if (!searchResults.length) {
      // Prevent form submission on Enter if there are no results
      if (e.key === 'Enter' && !searchQuery.trim()) {
        e.preventDefault();
        return;
      }
      return;
    }

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

  const toggleCategory = (categoryName) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(categoryName)
        ? prev.filter(name => name !== categoryName)
        : [...prev, categoryName];
      
      // Trigger search with current query and new categories
      debouncedSearch(searchQuery, newCategories, selectedEducationLevels);
      return newCategories;
    });
  };

  const toggleEducationLevel = (level) => {
    setSelectedEducationLevels(prev => {
      const newLevels = prev.includes(level)
        ? prev.filter(name => name !== level)
        : [...prev, level];
      
      // Trigger search with current query, categories, and education levels
      debouncedSearch(searchQuery, selectedCategories, newLevels);
      return newLevels;
    });
  };

  return (
    <div className="navbar-shadow">
      {/* Logo section - Adjusted width */}
      <div className="w-[220px] pl-6">
        <Link to="/">
          <img src={img_edugo} alt="Edugo Logo" className="h-11 w-auto" />
        </Link>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 mx-2"></div>

      {/* Search section */}
      <div className="flex-1 px-4 relative flex justify-center max-w-[1000px]">
        <form onSubmit={handleSearch} className="w-full">
          <div className="flex flex-col">
            <div className="relative z-30">
              <div className="flex items-center h-11 bg-gray-50 border border-gray-300 rounded-xl transition-all duration-300 hover:border-blue-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 group w-full overflow-hidden">
                <Search className="ml-3 text-gray-400 w-5 h-5 flex-shrink-0 group-hover:text-blue-500 group-focus-within:text-blue-500" />
                
                {/* Tags and Input Container - Updated overflow handling */}
                <div className="flex-1 flex items-center h-full relative min-w-0">
                  <div 
                    ref={searchContainerRef}
                    className="absolute inset-0 flex flex-wrap items-center gap-1.5 py-1.5 px-3 overflow-y-auto no-scrollbar"
                    style={{ maxHeight: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {selectedCategories.map(category => (
                      <span
                        key={category}
                        className="inline-flex items-center gap-1 px-2 h-6 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors duration-200 flex-shrink-0"
                        style={{ maxWidth: 'calc(100% - 24px)' }}
                      >
                        <span className="truncate">{category}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleCategory(category);
                          }}
                          className="hover:text-blue-800 w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-200/50 flex-shrink-0"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {selectedEducationLevels.map(level => (
                      <span
                        key={level}
                        className="inline-flex items-center gap-1 px-2 h-6 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors duration-200 flex-shrink-0"
                      >
                        <span className="truncate max-w-[150px]">{level}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            toggleEducationLevel(level);
                          }}
                          className="hover:text-indigo-800 w-4 h-4 flex items-center justify-center rounded-full hover:bg-indigo-200/50"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyDown={handleKeyDown}
                      placeholder={selectedCategories.length ? "Add more..." : "Search For Scholarship"}
                      className="flex-1 min-w-[120px] h-6 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-start"
                    />
                  </div>
                </div>

                {/* Menu Button */}
                <div className="h-full pr-3 pl-2 flex items-center border-l border-gray-200" ref={mainDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowMainDropdown(!showMainDropdown)}
                    className="p-1.5 hover:bg-gray-200/70 rounded-lg transition-colors duration-200 group-hover:text-blue-500"
                  >
                    <Menu className="w-5 h-5 text-gray-500" />
                  </button>
                  
                  {/* Main Dropdown Menu - Updated positioning */}
                  {showMainDropdown && (
                    <div className="absolute right-0 top-[calc(100%+0.5rem)] w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-[60]">
                      {/* Type of Scholarship Option */}
                      <div className="relative" ref={categoryDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCategoryDropdown(!showCategoryDropdown);
                            setShowEducationDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-700 group"
                        >
                          <span>Type of Scholarship</span>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {/* Category Dropdown - Updated positioning */}
                        {showCategoryDropdown && (
                          <div className="absolute -right-2 top-0 translate-x-full w-72 bg-white border border-gray-200 rounded-xl shadow-lg">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <h3 className="font-medium text-sm text-gray-900">Select Categories</h3>
                            </div>
                            <div className="max-h-[320px] overflow-y-auto py-2">
                              {categories.map(category => (
                                <label
                                  key={category.id}
                                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                                    checked={selectedCategories.includes(category.category_name)}
                                    onChange={() => toggleCategory(category.category_name)}
                                  />
                                  <span className="ml-2.5 text-sm text-gray-700">{category.category_name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Educational Level Option */}
                      <div className="relative" ref={educationDropdownRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setShowEducationDropdown(!showEducationDropdown);
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center justify-between text-sm font-medium text-gray-700 group"
                        >
                          <span>Educational Level</span>
                          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${showEducationDropdown ? 'rotate-90' : ''}`} />
                        </button>
                        
                        {/* Education Level Dropdown */}
                        {showEducationDropdown && (
                          <div className="absolute -right-2 top-0 translate-x-full w-72 bg-white border border-gray-200 rounded-xl shadow-lg">
                            <div className="px-4 py-3 border-b border-gray-100">
                              <h3 className="font-medium text-sm text-gray-900">Select Education Level</h3>
                            </div>
                            <div className="max-h-[320px] overflow-y-auto py-2">
                              {educationLevels.map(level => (
                                <label
                                  key={level}
                                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                                    checked={selectedEducationLevels.includes(level)}
                                    onChange={() => toggleEducationLevel(level)}
                                  />
                                  <span className="ml-2.5 text-sm text-gray-700">{level}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results Container - Updated width */}
            <div className="absolute left-0 right-0 top-full mt-2"> {/* Added padding-top */}
              {/* Search Results - Updated condition to include education levels */}
              {(searchQuery.trim() || selectedCategories.length > 0 || selectedEducationLevels.length > 0) && searchResults.length > 0 && (
                <div className="bg-white shadow-lg border border-gray-200 rounded-xl max-h-[400px] overflow-y-auto divide-y divide-gray-100 w-full">
                  {searchResults.map((result, index) => (
                    <Link
                      key={result.id}
                      to={`/detail/${result.id}`}
                      className={`block px-4 py-3 transition-colors duration-200 ${
                        index === selectedIndex 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-medium text-sm">{result.title}</h3>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-200 mx-2"></div>

      {/* Profile section - Adjusted width */}
      <div className="w-[220px] pr-6 flex justify-end items-center">
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
        <div className="font-medium text-gray-700 ml-3 max-w-[130px]">
          <h1 className="truncate">
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


