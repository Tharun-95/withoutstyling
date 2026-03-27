import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import MapView from './pages/MapView';
import AdminDashboard from './pages/AdminDashboard';
import IssueDetails from './pages/IssueDetails';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow flex flex-col pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/issue/:id" element={<IssueDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
