// Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginPage from './LoginPage/login';
import HomePage from './home/home'; 

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
};

export default AppRoutes;
