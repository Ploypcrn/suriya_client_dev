import axios from "axios";

const getHeader = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/dashboard/getHeader`, data);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while get Header:", error);
        throw error;
    }
}

const getExpenseSummary = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/dashboard/getExpenseSummary`, data);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while get Expense Summary:", error);
        throw error;
    }
}

const getExpenseComparison = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/dashboard/getExpenseComparison`, data);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while get Expense Comparison:", error);
        throw error;
    }
}

const getOperatingResult = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/dashboard/getOperatingResult`, data);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while get Operating Result:", error);
        throw error;
    }
}

export default {
    getHeader,
    getExpenseSummary,
    getExpenseComparison,
    getOperatingResult
};
