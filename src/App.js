import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header/header";
import Videos from "./Videos/videos";
import AppRoutes from "./routes.js";

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/videos" element={<Videos />} />
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
