import React from 'react';
import { FiPlus } from 'react-icons/fi'; // For the Add button
import { RiCloseFill } from 'react-icons/ri'; // For the close button
import '../assets/css/UI.CSS';

export function Button({ onClick, children, className }) {
  return (
    <button onClick={onClick} className={`btn ${className || ''}`}>
      {children}
    </button>
  );
}

export function Input({ placeholder, value, onChange, className }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`input ${className || ''}`}
    />
  );
}
export function Modal({ onClose, children }) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>
            <RiCloseFill size={24} />
          </button>
          {children}
        </div>
      </div>
    );
  }

export function Spinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
    </div>
  );
}