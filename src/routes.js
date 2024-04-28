import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginPage from './LoginPage/login';
import HomePage from './home/home'; 
import AdminPage from './AdminPage/adminPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adminPage" element={<AdminPage />} />
        </Routes>
    );
};

export default AppRoutes;
