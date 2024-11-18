import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const VendorDashboard = () => {
    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <h1>Vendor Dashboard</h1>
                <p>Welcome to your dashboard! Here you can manage your products and view orders from hotels.</p>
                <div className="dashboard-content">
                    <div className="section">
                        <h2>Manage Products</h2>
                        <p>Add, edit, or remove your seafood products.</p>
                        <button>View Products</button>
                    </div>
                    <div className="section">
                        <h2>View Orders</h2>
                        <p>Check orders placed by hotels for your products.</p>
                        <button>View Orders</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDashboard;
