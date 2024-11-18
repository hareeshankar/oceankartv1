import React from 'react';
import Navbar from '../components/Navbar';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
    return (
        <div>
            <Navbar />
            <div className="dashboard-container">
                <h1>Admin Dashboard</h1>
                <p>Welcome, Admin! Manage users, monitor platform activity, and oversee vendor and hotel accounts.</p>
                <div className="dashboard-content">
                    <div className="section">
                        <h2>Manage Users</h2>
                        <p>View, edit, or delete user accounts.</p>
                        <button>View Users</button>
                    </div>
                    <div className="section">
                        <h2>Platform Analytics</h2>
                        <p>View reports and analytics on platform usage.</p>
                        <button>View Analytics</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
