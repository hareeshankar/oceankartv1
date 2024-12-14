import React, { useState, useContext } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL;

const OTPRegister = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP, Step 3: Registration Form
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state
    const [userDetails, setUserDetails] = useState({
        fullName: '',
        email: '',
        line1: '',
        line2: '',
        area: '',
        city: '',
        state: '',
        zipcode: '',
    });

    const { login } = useContext(AuthContext); // Use login method from AuthContext
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        try {
            if (!/^\d{10}$/.test(phoneNumber)) {
                setMessage('Please enter a valid 10-digit phone number.');
                setError(true);
                return;
            }
    
            setLoading(true);
    
            // Check if the phone number is already registered
            const checkResponse = await axios.post(`${API_URL}/api/auth/otp/check-phone`, {
                phoneNumber: `+91${phoneNumber}`,
            });
    
            if (checkResponse.data.exists) {
                setMessage('Phone number is already registered. Please log in.');
                setError(true);
                setStep(1); // Stay on the same step
                return;
            }
    
            // Send OTP if phone number is not registered
            const response = await axios.post(`${API_URL}/api/auth/otp/send`, {
                phoneNumber: `+91${phoneNumber}`,
            });
    
            setMessage('OTP sent successfully!');
            setError(false);
            setStep(2); // Proceed to OTP verification step
        } catch (err) {
            console.error('Error sending OTP:', err.message);
            setMessage('Failed to send OTP. Please try again.');
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    
    const handleVerifyOTP = async () => {
        try {
            setLoading(true);
            const response = await axios.post(`${API_URL}/api/auth/otp/verify`, {
                phoneNumber: `+91${phoneNumber}`,
                otp,
            });
    
            if (response.data.success) {
                setMessage('OTP verified successfully!');
                setError(false);
                setStep(3); // Proceed to registration form
            } else {
                setMessage('Invalid OTP. Please try again.');
                setError(true);
            }
        } catch (err) {
            console.error('Error verifying OTP:', err.message);
            setMessage('Failed to verify OTP. Please try again.');
            setError(true);
        } finally {
            setLoading(false);
        }
    };
    

    const handleRegister = async () => {
        try {
            setLoading(true);

            const payload = {
                phoneNumber: `+91${phoneNumber}`,
                name: userDetails.fullName,
                email: userDetails.email,
                address: {
                    line1: userDetails.line1,
                    line2: userDetails.line2,
                    area: userDetails.area,
                    city: userDetails.city,
                    state: userDetails.state,
                    zipcode: userDetails.zipcode,
                },
            };

            const response = await axios.post(`${API_URL}/api/auth/otp/register`, payload);

            if (response.data.success) {
                const token = response.data.token;

                // Use login method to set AuthContext and localStorage
                login(token);

                setMessage('Registration successful! Redirecting to store...');
                setError(false);
                setTimeout(() => navigate('/store'), 2000);
            } else {
                setMessage(response.data.message || 'Registration failed.');
                setError(true);
            }
        } catch (err) {
            console.error('Error during registration:', err.message);
            setMessage('Failed to register. Please try again.');
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
                margin: 'auto',
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h4" textAlign="center">
                {step === 1 ? 'OTP Registration' : step === 2 ? 'Verify OTP' : 'Complete Registration'}
            </Typography>

            {loading && <CircularProgress sx={{ margin: 'auto' }} />}

            {!loading && step === 1 && (
                <>
                    <TextField
                        label="Phone Number"
                        variant="outlined"
                        fullWidth
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        helperText="Enter 10-digit phone number (without +91)"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendOTP}
                        fullWidth
                    >
                        Send OTP
                    </Button>
                </>
            )}

            {!loading && step === 2 && (
                <>
                    <TextField
                        label="Enter OTP"
                        variant="outlined"
                        fullWidth
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleVerifyOTP}
                        fullWidth
                    >
                        Verify OTP
                    </Button>
                </>
            )}

            {!loading && step === 3 && (
                <>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        name="fullName"
                        fullWidth
                        value={userDetails.fullName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Email Address"
                        variant="outlined"
                        name="email"
                        fullWidth
                        value={userDetails.email}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Address Line 1"
                        variant="outlined"
                        name="line1"
                        fullWidth
                        value={userDetails.line1}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Address Line 2"
                        variant="outlined"
                        name="line2"
                        fullWidth
                        value={userDetails.line2}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Area"
                        variant="outlined"
                        name="area"
                        fullWidth
                        value={userDetails.area}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="City"
                        variant="outlined"
                        name="city"
                        fullWidth
                        value={userDetails.city}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="State"
                        variant="outlined"
                        name="state"
                        fullWidth
                        value={userDetails.state}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Zip Code"
                        variant="outlined"
                        name="zipcode"
                        fullWidth
                        value={userDetails.zipcode}
                        onChange={handleInputChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRegister}
                        fullWidth
                    >
                        Register
                    </Button>
                </>
            )}

            {message && (
                <Alert severity={error ? 'error' : 'success'}>
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default OTPRegister;
