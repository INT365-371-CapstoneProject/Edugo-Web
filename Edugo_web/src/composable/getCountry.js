import axios from "axios";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
const urlCountry = `${APT_ROOT}/api/country`;

const getCountry = async () => {
    const token = localStorage.getItem("token");
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    };
    
    try {
        const res = await axios.get(urlCountry, config);
        return res.data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export { getCountry, urlCountry };