import axios from "axios";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
const urlCategory = `${APT_ROOT}/api/category`;

const getCategory = async () => {
    try {
        const res = await axios.get(urlCategory);
        return res.data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export { getCategory, urlCategory };