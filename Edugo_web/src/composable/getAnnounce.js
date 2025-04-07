import axios from "axios";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
const token = localStorage.getItem("token");

// Decode JWT token to get role
const decodeToken = (token) => {
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

const decodedToken = decodeToken(token);
const role = decodedToken?.role;

const url = role === "admin" || role === "superadmin" 
    ? `${APT_ROOT}/api/announce-admin` 
    : `${APT_ROOT}/api/announce`;

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

const getAnnounceImage = async (id) => {
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
        const response = await axios.get(`${url}/${id}/image`, imageConfig);
        
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

const getAnnounceAttach = async (id) => {
    try {
        // ตรวจสอบว่า id มีค่าและเป็นตัวเลขหรือไม่
        if (!id || isNaN(parseInt(id))) {
            console.warn('Invalid ID for attachment request:', id);
            return null;
        }

        // ตรวจสอบข้อมูลประกาศก่อนเพื่อดูว่ามีไฟล์แนบหรือไม่
        const announceData = await getAnnounceById(id);
        if (!announceData || !announceData.attach_file) {
            console.log(`No attachment available for announcement ID ${id}`);
            return null;
        }

        const attachConfig = {
            ...config,
            responseType: 'blob',
            headers: {
                ...config.headers,
                'Accept': 'application/pdf, application/octet-stream'
            }
        };
        
        const response = await axios.get(`${url}/${id}/attach`, attachConfig);
        
        if (response.data) {
            const attachUrl = URL.createObjectURL(response.data);
            return attachUrl;
        }
        return null;
    } catch (error) {
        console.error('Error fetching attachment:', error);
        return null;
    }
};

export { getAnnounce, getAnnounceById, url, APT_ROOT, getAnnounceImage, getAnnounceAttach };