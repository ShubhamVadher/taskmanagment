import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from '../media/image.png';
import './Navbar.css';

export const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [displayName, setDisplayName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const getDisplayName = () => {
    if (!user) return '';
    const isSocial = user["https://your-app.com/isSocial"];
    return isSocial
      ? user.name
      : user["https://your-app.com/username"] || user.nickname || user.name;
  };
  const url="https://taskmanagment-backend-dnst.onrender.com";
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${url}/logout`, { withCredentials: true });
      if (response.status === 200) {
        logout({ logoutParams: { returnTo: window.location.origin } });
      } else {
        alert('Logout failed on server. Please try again.');
      }
    } catch (err) {
      alert('Logout failed on server. Please try again.');
      console.error('Backend logout failed:', err);
    }
    // logout({ logoutParams: { returnTo: window.location.origin } });
  };

  useEffect(() => {
    const sendToBackend = async () => {
      if (isAuthenticated && user) {
        try {
          const nameToSend = getDisplayName();
          const response = await axios.post(
            `${url}/signin`,
            { email: user.email, name: nameToSend },
            { withCredentials: true }
          );
          setDisplayName(response.data.name);
        } catch (err) {
          console.error("Signin failed:", err);
          setDisplayName(user.name || user.nickname || user.username || "");
        }
      }
    };
    sendToBackend();
  }, [isAuthenticated, user]);

  const handleLogin = () => loginWithRedirect();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-title">
          <img src={logo} alt="Logo" />
          {isAuthenticated && <span className="nav-user-small">Hello, {displayName}</span>}
        </Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        {isAuthenticated ? (
          <>
            <Link to="createtask" className="nav-link" onClick={() => setMenuOpen(false)}>Create Task</Link>
            <Link to="viewtasks" className="nav-link" onClick={() => setMenuOpen(false)}>Tasks</Link>
            <span className="nav-user-large">Hello, {displayName}</span>
            <button className="nav-button logout-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button className="nav-button login-button" onClick={handleLogin}>Log In</button>
        )}
      </div>
    </nav>
  );
};
