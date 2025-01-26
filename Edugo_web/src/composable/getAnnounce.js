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

export const getAnnounce = async (page = 1) => {
    try {
        const response = await axios.get(`${url}?page=${page}&limit=1`, config);
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

export { getAnnounceById, url, APT_ROOT };