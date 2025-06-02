import axios from "axios";

// cheque/getCheque
const getCheque = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/cheque/getCheque`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getCheque :", error);
        throw error;
    }
};

// cheque/searchCheque
const searchCheque = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/cheque/searchCheque`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while searchCheque :", error);
        throw error;
    }
}

// cheque/createCheque
const createCheque = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/cheque/createCheque`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while createCheque :", error);
        throw error;
    }
};

// cheque/updateCheque
const updateCheque = async (data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/api/v1/cheque/updateCheque`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while updateCheque :", error);
        throw error;
    }
};


// bill/deleteCheque
const deleteCheque = async (data) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/api/v1/cheque/deleteCheque`, { data });
        return response.data;
    } catch (error) {
        console.error("An error occurred while deleteCheque :", error);
        throw error;
    }
};

export default {
    getCheque,
    searchCheque,
    createCheque,
    updateCheque,
    deleteCheque
}