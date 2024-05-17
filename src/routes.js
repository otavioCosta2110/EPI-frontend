import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginPage from './LoginPage/login';
import HomePage from './home/home'; 
import AdminPage from './AdminPage/adminPage';
import RegisterPage from './RegisterPage/register';
import RegisterStudent from './RegisterStudent/register';
import VideosPage from './Videos/Videos'; 
import MaterialsPage from './Materials/materials'; 
import ChallengesPage from './Challenges/challenges';
import VideoPage from './Videos/VideoPage';
import VideoRegister from './AdminPage/Videos/VideosRegister';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adminPage" element={<AdminPage />} />
            <Route path="/registerVideo" element={<VideoRegister />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/materials" element={<MaterialsPage />}/>
            <Route path="/challenges" element={<ChallengesPage />}/>
            <Route path="/videos/:id" element={<VideoPage />}/>
            <Route path="/registerStudent" element={<RegisterStudent />} />
        </Routes>
    );
};

export default AppRoutes;
