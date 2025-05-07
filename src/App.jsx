import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Promotions from './pages/Promotions';
import Notes from './pages/Notes';
import Performance from './pages/Performance';
import Header from './components/Header'; // Import the Header component
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* Include Header */}
        <Header />

        <div className="app-content">
          <Sidebar />

          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/promotions" element={<Promotions />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/performance" element={<Performance />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;