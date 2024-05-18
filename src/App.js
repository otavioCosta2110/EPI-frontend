import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header/header";
import Home from "./home/home.js";
import AppRoutes from "./routes.js";

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
