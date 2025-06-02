import axios from "axios";

const getUser = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/users/getUsersByUserId`);
        // console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getUser :", error);
        throw error;
    }
}
// users/getUsers
const getUsersAll = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/users/getUsers`);
        // console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getUsersAll :", error);
        throw error;
    }
};

const getUserByUserId = async (userId) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/users/getUsersByUserId/${userId}`);
        // console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getUserByUserId :", error);
        throw error;
    }
};

// const getUser = async () => {
//     try {
//         const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/user/admin`);
//         console.log('<<< getUser response', response);
//         return response.data;
//     } catch (error) {
//         console.log('<<< getUser error', error);
//         throw error;
//     }
// };

export const getActionByList = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}/api/v1/user/admin/list`);
        return response.data;
    } catch (error) {
        console.error("An error occurred while getActionByList :", error);
        throw error;
    }
};

export default {
    getUser,
    getUsersAll,
    getUserByUserId,
    getActionByList,
}
