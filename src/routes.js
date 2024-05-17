import React from 'react';
import { Routes, Route } from 'react-router-dom'; 

import LoginPage from './LoginPage/login';
import HomePage from './home/home'; 
import AdminPage from './AdminPage/adminPage';
import RegisterPage from './RegisterPage/register';
import RegisterStudent from './RegisterStudent/register';
import VideosPage from './Videos/videos'; 
import MaterialsPage from './Materials/materials'; 
import ChallengesPage from './Challenges/challenges';
import JsPage from './Videos/js/jsPage'; 
import HtmlPage from './Videos/html/htmlPage'; 
import CssPage from './Videos/css/cssPage';
import ForumsPage from './Forums/forums'
import ForumPage from './Forums/ForumPage/forum'


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
            <Route path="/videos/js" element={<JsPage />}/>
            <Route path="/videos/html" element={<HtmlPage />}/>
            <Route path="/videos/css" element={<CssPage />}/>
            <Route path="/registerStudent" element={<RegisterStudent />} />
            <Route path="/forums" element={<ForumsPage />} />
            <Route path="/forums/:id" element={<ForumPage />} />
        </Routes>
    );
};

export default AppRoutes;
