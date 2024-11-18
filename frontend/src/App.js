import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Store from './pages/Store';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Store />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/hotel-dashboard" element={<Store />} />
                <Route path="/vendor-dashboard" element={<VendorDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;
