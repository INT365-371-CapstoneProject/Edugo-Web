import axios from "axios";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
const url = `${APT_ROOT}/api/announce`;
const token = localStorage.getItem("token");
const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
};

const getAnnounce = async (page = 1) => {
    try {
        // แก้ไขจาก limit=1 เป็น limit=10 หรือตามที่ต้องการ
        const response = await axios.get(`${url}?page=${page}`, config);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
};

const getAnnounceById = async (id) => {
    try {
        const response = await axios.get(`${url}/${id}`, config);
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const getAnnounceImage = async (id) => {
    try {
        // แก้ไข URL endpoint และแยก config สำหรับ image request
        const imageConfig = {
            ...config,
            responseType: 'blob',
            headers: {
                ...config.headers,
                'Accept': 'image/*'
            }
        };
        
        // ใช้ APT_ROOT แทน VITE_API เพื่อให้ตรงกับ base URL ที่ใช้
        const response = await axios.get(`${APT_ROOT}/api/announce/${id}/image`, imageConfig);
        
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

export { getAnnounce, getAnnounceById, url, APT_ROOT };