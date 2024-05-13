// Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginPage from './LoginPage/login';
import HomePage from './home/home'; 
import VideosPage from './Videos/videos'; 
import MaterialsPage from './Materials/materials'; 
import ChallengesPage from './Challenges/challenges';
import JsPage from './Videos/js/jsPage'; 
import CssPage from './Videos/css/cssPage'; 
import HtmlPage from './Videos/html/htmlPage'; 

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/videos" element={<VideosPage />} />
            <Route path="/materials" element={<MaterialsPage />}/>
            <Route path="/challenges" element={<ChallengesPage />}/>
            <Route path="/videos/js" element={<JsPage />}/>
            <Route path="/videos/css" element={<CssPage />}/>
            <Route path="/videos/html" element={<HtmlPage />}/>
        </Routes>
    );
};

export default AppRoutes;
