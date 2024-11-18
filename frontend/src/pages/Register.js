import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import '../styles/Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'hotel', // Default role
    });

    const [message, setMessage] = useState('');
    const navigate = useNavigate();


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(formData);
            setMessage(response.data.message);
            // Redirect to the login page upon successful registration
            navigate('/login');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="hotel">Hotel</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                        <option value="delivery">Delivery Partner</option>
                    </select>
                    <button type="submit">Register</button>
                </form>
                <p className="auth-message">{message}</p>
            </div>
        </div>
    );
};

export default Register;
