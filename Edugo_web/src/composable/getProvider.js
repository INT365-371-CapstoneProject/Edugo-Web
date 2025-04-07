import axios from "axios";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
const urlAdmin = `${APT_ROOT}/api/admin`;
// สร้างฟังก์ชันที่จะรับ token เป็น parameter
const getConfigWithToken = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// ใช้ token จาก localStorage เป็นค่าเริ่มต้น
const getDefaultConfig = () => {
  const token = localStorage.getItem("token");
  return getConfigWithToken(token);
};

// Simplify getProvider to just handle the current page
const getProvider = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${urlProvider}?page=${page}&limit=${limit}`, getDefaultConfig());
    
    if (res.data && res.data.pagination && res.data.providers) {
      return {
        data: res.data.providers,
        pagination: res.data.pagination
      };
    } else {
      console.warn("Unexpected API response format:", res.data);
      return {
        data: [],
        pagination: {
          limit: limit,
          page: page,
          total: 0,
          total_page: 0
        }
      };
    }
  } catch (error) {
    
    return {
      data: [],
      pagination: {
        limit: limit,
        page: page,
        total: 0,
        total_page: 0
      }
    };
  }
};

const getAllUser = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${urlAdmin}/user?page=${page}&limit=${limit}`, getDefaultConfig());
    
    // Return formatted data structure with pagination
    if (res.data && res.data.users) {
      return {
        data: res.data.users,
        pagination: res.data.pagination || {
          limit: limit,
          page: page,
          total: res.data.count || res.data.users.length,
          total_page: res.data.pagination?.total_page || Math.ceil((res.data.count || res.data.users.length) / limit)
        },
        currentUser: {
          role: res.data.role,
          username: res.data.username
        }
      };
    } else {
      console.warn("Unexpected API response format:", res.data);
      return {
        data: [],
        pagination: {
          limit: limit,
          page: page,
          total: 0,
          total_page: 0
        },
        currentUser: null
      };
    }
  } catch (error) {
    return {
      data: [],
      pagination: {
        limit: limit,
        page: page,
        total: 0,
        total_page: 0
      },
      currentUser: null
    };
  }
}

// Updated manageUser function to use axios and urlAdmin
const manageUser = async (data) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.post(
            `${urlAdmin}/manage-user`, 
            data,
            getConfigWithToken(token)
        );
        
        return response.data;
    } catch (error) {
        console.error('Error managing user:', error);
        return {
            success: false,
            message: error.response?.data?.message || error.message || 'An error occurred while managing user'
        };
    }
};

export { getProvider, getAllUser, manageUser };