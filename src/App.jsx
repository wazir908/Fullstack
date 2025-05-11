import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import OpenJobs from './pages/OpenJobs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotificationComponent from './components/NotificationBell';
import Auth from './pages/auth/Login';

function PrivateLayout({ children, notifications, setNotifications }) {
  return (
    <div className="app-layout">
      <Header />
      <NotificationComponent
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="app-content">
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function PublicLayout({ children }) {
  return (
    <div className="public-layout">
      {children}
    </div>
  );
}

function App() {
  const [notifications, setNotifications] = useState([]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/apply/:jobId" element={
          <PublicLayout>
            <Apply />
          </PublicLayout>
        } />
        
        <Route path="/login" element={
          <PublicLayout>
            <Auth />
          </PublicLayout>
        } />

        {/* Private Routes */}
        <Route path="/" element={
          <PrivateLayout notifications={notifications} setNotifications={setNotifications}>
            <Dashboard />
          </PrivateLayout>
        } />
        <Route path="/employees" element={
          <PrivateLayout notifications={notifications} setNotifications={setNotifications}>
            <Employees />
          </PrivateLayout>
        } />
        <Route path="/promotions" element={
          <PrivateLayout notifications={notifications} setNotifications={setNotifications}>
            <Promotions />
          </PrivateLayout>
        } />
        <Route path="/notes" element={
          <PrivateLayout notifications={notifications} setNotifications={setNotifications}>
            <Notes />
          </PrivateLayout>
        } />
        <Route path="/performance" element={
          <PrivateLayout notifications={notifications} setNotifications={setNotifications}>
            <Performance />
          </PrivateLayout>
        } />
        <Route path="/recruitment" element={
          <PrivateLayout notifications={notifications} setNotifications={setNotifications}>
            <Recruitment />
          </PrivateLayout>
        } />
        <Route path="/openjobs" element={
          <PrivateLayout notifications={notifications} setNotifications={setNotifications}>
            <OpenJobs />
          </PrivateLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;