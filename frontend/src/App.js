import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Layout with Navbar
import Store from './pages/Store';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import OTPLogin from './pages/OTPLogin'; // OTP Login Page
import OTPRegister from './pages/OTPRegister'; // OTP Register Page
import ProtectedRoute from './components/ProtectedRoute'; // Authentication Guard

function App() {
    return (
        <Router>
            <Routes>
                {/* Routes with Navbar */}
                <Route element={<Layout />}>
                    <Route path="/" element={<Store />} />
                    <Route path="/store" element={<Store />} />
                    
                    {/* Protected Routes */}
                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <CheckoutPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <OrderHistoryPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    
                    {/* Public Routes */}
                    <Route path="/otp-login" element={<OTPLogin />} />
                    <Route path="/otp-register" element={<OTPRegister />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
