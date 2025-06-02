import axios from "axios";

const calculateIncome = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/incomeExpenses/calculateIncome`);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while calculating expenses:", error);
        throw error;
    }
}

const calculateExpenses = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/incomeExpenses/calculateExpenses`);
        console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while calculating expenses:", error);
        throw error;
    }
}

export default {
    calculateIncome,
    calculateExpenses
};