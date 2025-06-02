import axios from "axios";

const getExpense = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/expense/getExpense`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getExpense :", error);
        throw error;
    }
};

const getExpenseById = async (data) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/expense/getExpenseById/${data}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getExpenseById :", error);
        throw error;
    }
}

const searchExpense = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/expense/searchExpense`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while searchExpense :", error);
        throw error;
    }
}

const createExpense = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/expense/createExpense`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while createExpense :", error);
        throw error;
    }
};

const updateExpense = async (data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/api/v1/expense/updateExpense`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while updateExpense :", error);
        throw error;
    }
}

const deleteExpense = async (data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/api/v1/expense/deleteExpense`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while deleteExpense :", error);
        throw error;
    }
};

export default {
    getExpense,
    getExpenseById,
    searchExpense,
    createExpense,
    updateExpense,
    deleteExpense
}