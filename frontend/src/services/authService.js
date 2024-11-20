import axios from 'axios';

// Use process.env to dynamically load the API URL based on the environment
const API_URL = process.env.REACT_APP_API_URL; 
const AUTH_API_URL = `${API_URL}/api/auth`; // Use backticks for template literals

// Function to register a user
export const registerUser = async (userData) => {
    return axios.post(`${AUTH_API_URL}/register`, userData);
};

// Function to log in a user
export const loginUser = async (userData) => {
    return axios.post(`${AUTH_API_URL}/login`, userData);
};
