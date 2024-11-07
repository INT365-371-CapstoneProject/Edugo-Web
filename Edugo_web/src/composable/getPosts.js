import axios from "axios";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
const url = `${APT_ROOT}/api/posts`;

const getPosts = async () => {
    try {
        const res = await axios.get(url);
        return res.data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

const getPostById = async (id) => {
    try {
        const res = await axios.get(`${url}/${id}`);
        return res.data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}


export { getPosts, getPostById, url };