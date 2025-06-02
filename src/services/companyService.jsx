import axios from "axios";

// company/getCompany

const getCompany = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/company/getCompany`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getCompany :", error);
        throw error;
    }
};

const getCompanyById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/company/getCompanyById/${id}`);
        return response.data;
    }
    catch (error) {
        console.error("An error occurred while getCompanyById :", error);
        throw error;
    }
}

export default {
    getCompany,
    getCompanyById,
};