import axios from 'axios';

const API_URL = 'https://oceankartv1.onrender.com/api/auth';

export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (userData) => {
    return axios.post(`${API_URL}/login`, userData);
};
