import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaRocket, FaRegStickyNote, FaCalendarAlt, FaFileInvoiceDollar, FaChartBar, FaTasks, FaUserTie } from 'react-icons/fa'; // Additional icons
import '../assets/css/sidebar.css';


export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="sidebar">
    <div className="sidebar-header">
  <img src="https://remote-opus.com/wp-content/uploads/2025/01/remote-opus-logo-1-2048x2048.png" alt="HR Admin Logo" className="sidebar-logo" />
</div>
      <ul className="sidebar-menu">
        <li>
          <Link className={isActive('/')} to="/">
            <FaTachometerAlt />
            Dashboard
          </Link>
        </li>
        <li>
          <Link className={isActive('/employees')} to="/employees">
            <FaUsers />
            Employees
          </Link>
        </li>
        <li>
          <Link className={isActive('/attendance')} to="/attendance">
            <FaCalendarAlt />
            Attendance
          </Link>
        </li>
        <li>
          <Link className={isActive('/payroll')} to="/payroll">
            <FaFileInvoiceDollar />
            Payroll
          </Link>
        </li>
        <li>
          <Link className={isActive('/performance')} to="/performance">
            <FaChartBar />
            Performance
          </Link>
        </li>
        <li>
          <Link className={isActive('/training')} to="/training">
            <FaTasks />
            Training
          </Link>
        </li>
        <li>
          <Link className={isActive('/recruitment')} to="/recruitment">
            <FaUserTie />
            Recruitment
          </Link>
        </li>
        <li>
          <Link className={isActive('/notes')} to="/notes">
            <FaRegStickyNote />
            Notes
          </Link>
        </li>
      </ul>
    </nav>
  );
}
