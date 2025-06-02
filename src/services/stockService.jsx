import axios from "axios";

const getStock = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/stock/getStock`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while stock :", error);
        throw error;
    }
};

export default {
    getStock,
};