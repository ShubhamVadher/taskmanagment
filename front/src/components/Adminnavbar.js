import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Adminnavbar.css';
import axios from 'axios';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/adminlogout', {
        withCredentials: true
      });
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      document.cookie = 'AdminToken=; Max-Age=0; path=/';
      navigate('/admin');
    }
  };

  const links = [
    { label: 'All Tasks', path: '/admintasks' },
    { label: 'All Users', path: '/adminusers' },
  ];

  return (
    <nav className="admin-navbar">
      {/* Brand */}
      <div className="admin-navbar-brand" onClick={() => navigate('/adminpage')}>
        <div className="admin-badge">ADMIN</div>
        <span className="admin-brand-name">TaskFlow</span>
      </div>

      {/* Desktop links */}
      <ul className="admin-nav-links">
        {links.map((link) => (
          <li key={link.label}>
            <button
              className={`admin-nav-btn ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Logout */}
      <button className="admin-logout-btn" onClick={handleLogout}>
        Sign Out
      </button>

      {/* Mobile hamburger */}
      <button className="admin-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="admin-mobile-menu">
          {links.map((link) => (
            <button
              key={link.label}
              className={`admin-mobile-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => { navigate(link.path); setMenuOpen(false); }}
            >
              {link.label}
            </button>
          ))}
          <button className="admin-mobile-logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;