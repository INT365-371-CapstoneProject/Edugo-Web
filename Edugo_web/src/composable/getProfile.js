const APT_ROOT = import.meta.env.VITE_API_ROOT;
const urlProfile = `${APT_ROOT}/api/profile`;
import axios from "axios";

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

const getAvatar = async () => {
  try {
    const config = getDefaultConfig();
    // แก้ไข URL endpoint และแยก config สำหรับ image request
    const imageConfig = {
      ...config,
      responseType: "blob",
      headers: {
        ...config.headers,
        Accept: "image/*",
      },
    };

    // ใช้ APT_ROOT แทน VITE_API เพื่อให้ตรงกับ base URL ที่ใช้
    const response = await axios.get(`${urlProfile}/avatar`, imageConfig);

    // ตรวจสอบว่ามี response.data ก่อนสร้าง URL
    if (response.data) {
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const getProfile = async () => {
    try {
        const response = await axios.get(urlProfile, getDefaultConfig());
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

// เพิ่มฟังก์ชันใหม่สำหรับตรวจสอบสถานะผู้ใช้
const checkUserStatus = async (token) => {
    if (!token) return null;
    
    try {
        const customConfig = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        };
        
        const response = await axios.get(urlProfile, customConfig);
        return response.data;
    } catch (error) {
        console.error("Error checking user status:", error);
        return null;
    }
}

export { getAvatar, getProfile, urlProfile, checkUserStatus, getConfigWithToken };
