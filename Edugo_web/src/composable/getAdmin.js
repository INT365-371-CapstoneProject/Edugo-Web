import axios from "axios";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
const urlSuperAdmin = `${APT_ROOT}/api`;

// Function to register a new administrator
export async function registerAdmin(adminData) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(`${urlSuperAdmin}/superadmin`, adminData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error registering administrator:', error);
    
    // Improved error handling to extract message from axios error response
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to register administrator');
    }
    
    throw error;
  }
}
