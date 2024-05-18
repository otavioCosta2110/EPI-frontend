import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginPage from './LoginPage/login';
import HomePage from './home/home'; 
import AdminPage from './AdminPage/adminPage';
import RegisterPage from './RegisterPage/register';
import RegisterStudent from './RegisterStudent/register';
import MaterialsPage from './Materials/materials'; 
import ChallengesPage from './Challenges/challenges';
import VideosPage from './Videos/videos'; 
import VideoPage from './Videos/VideoPage';
import VideoRegister from './AdminPage/Videos/VideosRegister';
import ForumsPage from './Forums/forums'
import ForumPage from './Forums/ForumPage/forum'


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adminpage" element={<AdminPage />} />
            <Route path="/registervideo" element={<VideoRegister />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/materials" element={<MaterialsPage />}/>
            <Route path="/challenges" element={<ChallengesPage />}/>
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/videos/:id" element={<VideoPage />}/>
            <Route path="/registerstudent" element={<RegisterStudent />} />
            <Route path="/forums" element={<ForumsPage />} />
            <Route path="/forums/:id" element={<ForumPage />} />
        </Routes>
    );
};

export default AppRoutes;
