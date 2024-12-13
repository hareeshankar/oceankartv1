import React, { useState, useEffect, useContext } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    CircularProgress,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const ProfilePage = () => {
    const { user, token, login } = useContext(AuthContext); // Get user info, token, and login function from AuthContext
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState({
        line1: '',
        line2: '',
        area: '',
        city: '',
        state: '',
        zipcode: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);

    // Function to fetch user details
    const fetchUserDetails = async (authToken) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/users/details`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            const data = response.data;
            setEmail(data.email || '');
            setAddress(data.address || {
                line1: '',
                line2: '',
                area: '',
                city: '',
                state: '',
                zipcode: '',
            });
            setError(null); // Clear any existing errors
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch user details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Check token in localStorage if not present in context
        const storedToken = token || localStorage.getItem('token');
        if (storedToken) {
            if (!token) {
                // Simulate login if token is not in context
                login(storedToken);
            }
            fetchUserDetails(storedToken);
        } else {
            setError('You are not logged in. Redirecting to login page.');
            setTimeout(() => {
                window.location.href = '/otp-login'; // Redirect to login page
            }, 2000);
        }
    }, [token, login]);

    const handleAddressChange = (field, value) => {
        setAddress((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${API_URL}/api/users/update`,
                {
                    userId: user.id,
                    email,
                    address,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('User details updated successfully:', response.data); // Log the success response
            setSuccess(true);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user details:', error.response || error.message); // Log error response
            setError(error.response?.data?.error || 'Failed to update details.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleCancel = () => {
        setEditMode(false);
        fetchUserDetails(token); // Reset to original details
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Profile
            </Typography>
            {loading && (
                <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
            )}
            {success && <Alert severity="success">Details updated successfully!</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* Email */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                    />
                </Grid>

                {/* Address */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Address Line 1"
                        value={address.line1}
                        onChange={(e) => handleAddressChange('line1', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Address Line 2"
                        value={address.line2}
                        onChange={(e) => handleAddressChange('line2', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Area"
                        value={address.area}
                        onChange={(e) => handleAddressChange('area', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="City"
                        value={address.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="State"
                        value={address.state}
                        onChange={(e) => handleAddressChange('state', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Zipcode"
                        value={address.zipcode}
                        onChange={(e) => handleAddressChange('zipcode', e.target.value)}
                        disabled={!editMode}
                        variant="outlined"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 3 }}>
                {editMode ? (
                    <>
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={handleSave}
                                disabled={loading}
                            >
                                Save
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => setEditMode(true)}
                        >
                            Edit
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default ProfilePage;
