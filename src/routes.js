// Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginPage from './LoginPage/login';
import HomePage from './home/home'; 
import VideosPage from './Videos/videos'; 
import MaterialsPage from './Materials/materials'; 
import ChallengesPage from './Challenges/challenges'; 

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/materials" element={<MaterialsPage />}/>
            <Route path="/challenges" element={<ChallengesPage />}/>
        </Routes>
    );
};

export default AppRoutes;
