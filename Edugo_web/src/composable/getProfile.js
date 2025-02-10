const APT_ROOT = import.meta.env.VITE_API_ROOT;
const urlProfile = `${APT_ROOT}/api/profile`;
import axios from "axios";
const token = localStorage.getItem("token");
const config = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};
const getAvatar = async () => {
  try {
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
        const response = await axios.get(urlProfile, config);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export { getAvatar, getProfile, urlProfile };
