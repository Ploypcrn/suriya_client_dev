import axios from "axios";

// bill/generateBillNo
const generateBillNo = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/generateBillNo`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while generateBillNo :", error);
        throw error;
    }
};

// bill/getBill
const getBill = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/getBill`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getBill :", error);
        throw error;
    }
};

// bill/getBillByBillNo
const getBillByBillNo = async (billOn) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/getBillByBillNo/${billOn}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getBillByBillNo :", error);
        throw error;
    }
};

const getBillById = async (id) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/getBillById/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getBillById :", error);
        throw error;
    }
};

// bill/searchBill
const searchBill = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/searchBill`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while searchBill :", error);
        throw error;
    }
}

// bill/createBill
const createBill = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/createBill`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while createBill :", error);
        throw error;
    }
};

// createBillFreeText
const createBillFreeText = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/createBillFreeText`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while createBillFreeText :", error);
        throw error;
    }
};

const createListProduct = async (data) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/createListProduct`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while createListProduct :", error);
        throw error;
    }
};

// bill/updateBill
const updateBill = async (id, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/updateBill/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while updateBill :", error);
        throw error;
    }
};

// bill/updateBillFreeText
const updateBillFreeText = async (id, data) => {
    try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/updateBillFreeText/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while updateBillFreeText :", error);
        throw error;
    }
};

// bill/deleteBill
const deleteBill = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/deleteBill/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while deleteBill :", error);
        throw error;
    }
}

const deleteListProductByInvoiceId = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/deleteListProductByInvoiceId/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while deleteListProductByInvoiceId :", error);
        throw error;
    }
};

const deleteProductById = async (id) => {
    try {
        const response = await axios.delete(`${import.meta.env.VITE_BASE_API_URL}/api/v1/bill/deleteProductById/${id}`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while deleteProductById :", error);
        throw error;
    }
};

export default {
    generateBillNo,
    getBill,
    getBillByBillNo,
    searchBill,
    createBill,
    createBillFreeText,
    createListProduct,
    updateBill,
    updateBillFreeText,
    deleteBill,
    deleteListProductByInvoiceId,
    deleteProductById,
    getBillById
}