import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const DeliveryDashboard = () => {
    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <h1>Delivery Partner Dashboard</h1>
                <p>Welcome to your dashboard! Track and manage deliveries for seafood orders from vendors to hotels.</p>
                <div className="dashboard-content">
                    <div className="section">
                        <h2>Assigned Deliveries</h2>
                        <p>View orders assigned for delivery and update status.</p>
                        <button>View Deliveries</button>
                    </div>
                    <div className="section">
                        <h2>Delivery History</h2>
                        <p>View completed deliveries and order details.</p>
                        <button>View History</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard;
