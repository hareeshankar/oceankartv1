import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // Import Navbar component

const Layout = () => {
    return (
        <>
            <Navbar /> {/* Persistent Navbar */}
            <main style={{ paddingTop: '70px' }}>
                <Outlet /> {/* Render child components */}
            </main>
        </>
    );
};

export default Layout;
