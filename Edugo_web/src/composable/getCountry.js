import axios from "axios";
const APT_ROOT = import.meta.env.VITE_API_ROOT;
const urlCountry = `${APT_ROOT}/api/country`;

const getCountry = async () => {
    try {
        const res = await axios.get(urlCountry);
        return res.data;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export { getCountry, urlCountry };