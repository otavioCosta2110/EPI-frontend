import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./LoginPage/login";
import AdminPage from "./AdminPage/adminPage";
import RegisterPage from "./RegisterPage/register";
import RegisterStudent from "./RegisterStudent/register";
import ChallengesPage from "./Challenges/challenges";
import VideosPage from "./Videos/videos";
import VideoPage from "./Videos/VideoPage";
import VideoRegister from "./AdminPage/Videos/VideosRegister";
import ForumsPage from "./Forums/forums";
import ForumPage from "./Forums/ForumPage/forum";
import MaterialRegister from "./AdminPage/Material/MaterialRegister";
import ChallengeRegister from "./AdminPage/Challenge/ChallengeRegister";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/videos" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/adminpage" element={<AdminPage />} />
      <Route path="/registervideo" element={<VideoRegister />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/challenges" element={<ChallengesPage />} />
      <Route path="/videos" element={<VideosPage />} />
      <Route path="/videos/:id" element={<VideoPage />} />
      <Route path="/registerstudent" element={<RegisterStudent />} />
      <Route path="/forums" element={<ForumsPage />} />
      <Route path="/forums/:id" element={<ForumPage />} />
      <Route
        path="/videos/:id/registermaterial"
        element={<MaterialRegister />}
      />
      <Route
        path="/videos/:id/registerchallenge"
        element={<ChallengeRegister />}
      />  
    </Routes>
  );
};

export default AppRoutes;
