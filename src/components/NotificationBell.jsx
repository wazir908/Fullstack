import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { io } from 'socket.io-client';

const socket = io('https://crm-backend-8e1q.onrender.com');

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    // Debugging: Add a test notification on mount
    setNotifications((prev) => [...prev, "Test notification!"]);

    socket.on('notification', (data) => {
      console.log('Received notification:', data);
      setNotifications((prev) => [data.message, ...prev]);
    });

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      socket.off('notification');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <button className="bell-button" onClick={() => setOpen(!open)}>
        <FaBell className="bell-icon" />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="dropdown-header">Notifications</div>
          <div className="notification-list">
            {notifications.length > 0 ? (
              notifications.map((note, index) => (
                <div key={index} className="notification-item">
                  {note}
                </div>
              ))
            ) : (
              <div className="notification-empty">No new notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;