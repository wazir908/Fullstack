// App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Promotions from './pages/Promotions';
import Notes from './pages/Notes';
import Performance from './pages/Performance';
import Header from './components/Header';
import './App.css';
import Recruitment from './pages/Recruitment';
import Apply from './pages/Apply';
import Login from './pages/Login';
import OpenJobs from './pages/OpenJobs';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationComponent from './components/NotificationBell';

function AppContent() {
  const [notifications, setNotifications] = useState([]);
  const location = useLocation();

  // 🔍 Pages that should NOT use the full layout (public view)
  const isPublicPage = location.pathname.startsWith('/apply');

  return (
    <div className="app-layout">
      {!isPublicPage && <Header />}
      {!isPublicPage && (
        <NotificationComponent
          notifications={notifications}
          setNotifications={setNotifications}
        />
      )}

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

      <div className="app-content">
        {!isPublicPage && <Sidebar />}

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/performance" element={<Performance />} />

            <Route
              path="/recruitment"
              element={<Recruitment setNotifications={setNotifications} />}
            />
            <Route path="/openjobs" element={<OpenJobs />} />

            {/* 🟢 Public Page: No header/sidebar */}
            <Route path="/apply/:jobId" element={<Apply />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;