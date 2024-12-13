import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Layout with persistent Navbar
import Store from './pages/Store';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrderHistoryPage from './components/OrderHistoryPage';
import ProfilePage from './components/ProfilePage';
import OTPLogin from './pages/OTPLogin'; // OTP Login Page
import OTPRegister from './pages/OTPRegister'; // OTP Register Page
import Register from './pages/Register'; // Existing Register Page
import Login from './pages/Login'; // Existing Login Page

function App() {
    return (
        <Router>
            <Routes>
                {/* Routes with Layout wrapping */}
                <Route
                    path="/"
                    element={
                        <Layout>
                            <Store />
                        </Layout>
                    }
                />
                <Route
                    path="/store"
                    element={
                        <Layout>
                            <Store />
                        </Layout>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <Layout>
                            <CartPage />
                        </Layout>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <Layout>
                            <CheckoutPage />
                        </Layout>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <Layout>
                            <OrderHistoryPage />
                        </Layout>
                    }
                />


                {/* New OTP-Based Routes */}
                <Route
                    path="/otp-login"
                    element={
                        <Layout>
                            <OTPLogin />
                        </Layout>
                    }
                />
                <Route
                    path="/otp-register"
                    element={
                        <Layout>
                            <OTPRegister />
                        </Layout>
                    }
                />

                {/* Old Register and Login Routes */}
                <Route
                    path="/register"
                    element={
                        <Layout>
                            <Register />
                        </Layout>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <Layout>
                            <Login />
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
