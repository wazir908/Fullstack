import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import io from 'socket.io-client'; // Import Socket.io-client
import '../assets/css/Header.css';

export default function Header({ successMessage, deleteError }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notificationRef = useRef(null);

  // Socket.io setup
  const socket = useRef(null); // Creating a ref for the socket connection

  // Set up the socket connection on mount
  useEffect(() => {
    socket.current = io('https://crm-backend-8e1q.onrender.com'); // Replace with your server URL

    // Listen for notifications from the server
    socket.current.on('notification', (message) => {
      console.log('New notification:', message);
      setNotifications((prev) => {
        const updatedNotifications = [message, ...prev]; // Latest notifications at the top
        // Persist new notifications in localStorage
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });
    });

    // Clean up on component unmount
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Fetch existing notifications from localStorage
  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(storedNotifications);
  }, []);

  // Add success or error notifications when an employee is added or deleted
  useEffect(() => {
    if (successMessage) {
      setNotifications((prev) => {
        const updatedNotifications = [successMessage, ...prev]; // Latest notifications at the top
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });
    }
    if (deleteError) {
      setNotifications((prev) => {
        const updatedNotifications = [deleteError, ...prev]; // Latest notifications at the top
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        return updatedNotifications;
      });
    }
  }, [successMessage, deleteError]);

  const toggleNotificationDropdown = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const removeNotification = (index) => {
    const updatedNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(updatedNotifications);
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>HR Admin Panel</h1>
        <p>Track Employees, Promotions, and Notes</p>
      </div>

      <div className="header-right">
        {/* Icons Container */}
        <div className="icons-container">
          {/* Notification Center */}
          <div className="notification-center" ref={notificationRef}>
            <button className="notification-icon" onClick={toggleNotificationDropdown}>
              <FaBell />
              <span className="notification-count">{notifications.length}</span>
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Recent Notifications</h3>
                </div>
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={index}>
                      <div className="notification-item">
                        <p>{notification}</p>
                        <button
                          className="notification-close"
                          onClick={() => removeNotification(index)} // Call remove function
                        >
                          &times;
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                {notifications.length === 0 && (
                  <div className="notification-empty">
                    <p>No new notifications 🎉</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="user-profile">
            <button className="user-profile-button">
              <FaUserCircle />
            </button>
          </div>

          {/* Settings */}
          <div className="settings">
            <button className="settings-button">
              <FaCog />
            </button>
          </div>

          {/* Logout */}
          <div className="logout">
            <button className="logout-button">
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}