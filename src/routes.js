import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginPage from './LoginPage/login';
import HomePage from './home/home'; 
import AdminPage from './AdminPage/adminPage';
import RegisterPage from './RegisterPage/register';
import VideosPage from './Videos/videos'; 
import MaterialsPage from './Materials/materials'; 
import ChallengesPage from './Challenges/challenges';
import JsPage from './Videos/js/jsPage'; 
import HtmlPage from './Videos/html/htmlPage'; 
import CssPage from './Videos/css/cssPage'; 

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adminPage" element={<AdminPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/materials" element={<MaterialsPage />}/>
            <Route path="/challenges" element={<ChallengesPage />}/>
            <Route path="/Videos/js" element={<JsPage />}/>
            <Route path="/Videos/html" element={<HtmlPage />}/>
            <Route path="/Videos/css" element={<CssPage />}/>
        </Routes>
    );
};

export default AppRoutes;
