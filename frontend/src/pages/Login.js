import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import '../styles/Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the login API
            const response = await loginUser(formData);
            const { token, user } = response.data; // Assuming the API returns { token, user }
            console.log(user)
            // Store the token in localStorage
            localStorage.setItem('token', token);

            // Navigate based on user role
            switch (user.role) {
                case 'hotel':
                    navigate('/hotel-dashboard');
                    break;
                case 'vendor':
                    navigate('/vendor-dashboard');
                    break;
                case 'admin':
                    navigate('/admin-dashboard');
                    break;
                case 'delivery':
                    navigate('/delivery-dashboard');
                    break;
                default:
                    navigate('/');
                    break;
            }
        } catch (error) {
            console.log(error)
            setMessage(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p className="auth-message">{message}</p>
            </div>
        </div>
    );
};

export default Login;
