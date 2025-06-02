import axios from "axios";

// getMasterPaymentType
const getMasterPaymentType = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/master/getMasterPaymentType`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getMasterPaymentType :", error);
        throw error;
    }
}

const getMasterBank = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/master/getMasterBank`);
        console.log("master bank : ", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getMasterBank :", error);
        throw error;
    }
}

const getMasterChequePaymentType = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/master/getMasterChequePaymentType`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getMasterChequePaymentType :", error);
        throw error;
    }
}

const getMasterDocument = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/master/getMasterDocument`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getMasterDocument :", error);
        throw error;
    }
}

const getMasterChequeStatus = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/master/getMasterChequeStatus`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getMasterChequeStatus :", error);
        throw error;
    }
}

const getMasterExpenseType = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/master/getMasterExpenseType`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getMasterExpenseType :", error);
        throw error;
    }
}



export default {
    getMasterPaymentType,
    getMasterBank,
    getMasterChequePaymentType,
    getMasterDocument,
    getMasterChequeStatus,
    getMasterExpenseType
};   