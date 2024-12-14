import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const OTPRegister = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP, Step 3: Registration Form
    const [message, setMessage] = useState('');
    const [error, setError] = useState(false);
    const [userDetails, setUserDetails] = useState({
        name: '',
        email: '',
        addressLine1: '',
        addressLine2: '',
        area: '',
        city: '',
        state: '',
        zipcode: '',
    });

    const navigate = useNavigate();

    const handleSendOTP = async () => {
        try {
            // Basic validation: ensure 10-digit phone number
            if (!/^\d{10}$/.test(phoneNumber)) {
                setMessage('Please enter a valid 10-digit phone number.');
                setError(true);
                return;
            }

            const response = await axios.post(`${API_URL}/api/auth/otp/send`, {
                phoneNumber: `+91${phoneNumber}`,
            });

            if (response.data.success) {
                setMessage('OTP sent successfully!');
                setError(false);
                setStep(2); // Proceed to OTP verification step
            } else {
                setMessage(response.data.message || 'Failed to send OTP.');
                setError(true);
            }
        } catch (err) {
            setMessage('Error sending OTP. Please try again.');
            setError(true);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/otp/verify`, {
                phoneNumber: `+91${phoneNumber}`,
                otp,
            });

            if (response.data.success) {
                setMessage('OTP verified successfully!');
                setError(false);
                setStep(3); // Proceed to registration form
            } else {
                setMessage(response.data.message || 'Failed to verify OTP.');
                setError(true);
            }
        } catch (err) {
            setMessage('Error verifying OTP. Please try again.');
            setError(true);
        }
    };

    const handleRegister = async () => {
        try {
            const payload = {
                phoneNumber: `+91${phoneNumber}`, // Include the +91 prefix
                name: userDetails.name,
                email: userDetails.email,
                address: {
                    addressLine1: userDetails.addressLine1,
                    addressLine2: userDetails.addressLine2,
                    area: userDetails.area,
                    city: userDetails.city,
                    state: userDetails.state,
                    zipcode: userDetails.zipcode,
                },
            };
    
            const response = await axios.post(`${API_URL}/api/auth/otp/register`, payload);
    
            if (response.data.success) {
                setMessage('Registration successful! Redirecting to login...');
                setError(false);
                setTimeout(() => navigate('/otp-login'), 2000); // Redirect to login after success
            } else {
                setMessage(response.data.message || 'Registration failed.');
                setError(true);
            }
        } catch (err) {
            console.error('Error during registration:', err.message);
            setMessage('Error during registration. Please try again.');
            setError(true);
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

            {/* Step 1: Send OTP */}
            {step === 1 && (
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

            {/* Step 2: Verify OTP */}
            {step === 2 && (
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

            {/* Step 3: Registration Form */}
            {step === 3 && (
                <>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        name="name"
                        fullWidth
                        value={userDetails.name}
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
                        name="addressLine1"
                        fullWidth
                        value={userDetails.addressLine1}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Address Line 2"
                        variant="outlined"
                        name="addressLine2"
                        fullWidth
                        value={userDetails.addressLine2}
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

            {/* Success/Error Message */}
            {message && (
                <Alert severity={error ? 'error' : 'success'}>
                    {message}
                </Alert>
            )}
        </Box>
    );
};

export default OTPRegister;
