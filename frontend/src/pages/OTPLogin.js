import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const API_URL = process.env.REACT_APP_API_URL;

const OTPLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Use AuthContext for login method

    const handleSendOtp = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${API_URL}/api/auth/otp/send`, {
                phoneNumber: `+91${phoneNumber.trim()}`,
            });
            setIsOtpSent(true);
        } catch (err) {
            setError('Failed to send OTP. Please check the phone number and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${API_URL}/api/auth/otp/verify`, {
                phoneNumber: `+91${phoneNumber.trim()}`,
                otp: otp.trim(),
            });
            if (response.data.success) {
                const loginResponse = await axios.post(`${API_URL}/api/auth/otp/login`, {
                    phoneNumber: `+91${phoneNumber.trim()}`,
                });
                console.log(loginResponse.data.token);
                login(loginResponse.data.token); // Use AuthContext's login method
                navigate('/store'); // Redirect to the store page
            } else {
                setError('Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('Failed to verify OTP. Please try again. in otp login js');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    OTP Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}

                {!isOtpSent ? (
                    <Box sx={{ mt: 3, width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            variant="outlined"
                            placeholder="Enter your 10-digit phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            margin="normal"
                            disabled={loading}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleSendOtp}
                            disabled={loading || phoneNumber.trim().length !== 10}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ mt: 3, width: '100%' }}>
                        <TextField
                            fullWidth
                            label="Enter OTP"
                            variant="outlined"
                            placeholder="Enter the 6-digit OTP sent to your phone"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            margin="normal"
                            disabled={loading}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.trim().length !== 6}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
                        </Button>
                        <Button
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => setIsOtpSent(false)}
                            disabled={loading}
                        >
                            Resend OTP
                        </Button>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default OTPLogin;
