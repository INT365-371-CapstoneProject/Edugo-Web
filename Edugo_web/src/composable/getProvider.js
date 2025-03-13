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

const getProvider = async () => {
    try{
        const res = await axios.get(`${urlAdmin}/provider`, getDefaultConfig());
        return res.data;
    }
    catch (error) {
        console.error("Error:", error);
        return null;
    }
}

export { getProvider };