import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Import your pages
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import User from "./pages/User";
import IssueDetails from "./pages/IssueDetails";
import MapView from "./pages/MapView";
import ReportIssue from "./pages/ReportIssue";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route → go to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/report" element={<ReportIssue />} />
        <Route path="/issue/:id" element={<IssueDetails />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;