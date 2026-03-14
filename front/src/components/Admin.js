import React, { useState } from 'react'
import './Admin.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Admin = () => {
  const [adminId, setAdminId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
    const navigate=useNavigate();
  const url="http://localhost:5000";
const ENV_ADMIN_ID = process.env.REACT_APP_ADMIN_ID
const ENV_ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD

  const handleLogin = async (e) => {
  e.preventDefault()
  setError('')
  setIsLoading(true)

  // Validate fields first
  if (!adminId && !password) {
    setError('Admin ID and password are required.')
    setIsLoading(false)
    return
  } else if (!adminId) {
    setError('Admin ID is required.')
    setIsLoading(false)
    return
  } else if (!password) {
    setError('Password is required.')
    setIsLoading(false)
    return
  } else if (adminId !== ENV_ADMIN_ID && password !== ENV_ADMIN_PASSWORD) {
    setError('Invalid Admin ID and password.')
    setIsLoading(false)
    return
  } else if (adminId !== ENV_ADMIN_ID) {
    setError('Admin ID does not match our records.')
    setIsLoading(false)
    return
  } else if (password !== ENV_ADMIN_PASSWORD) {
    setError('Incorrect password. Please try again.')
    setIsLoading(false)
    return
  }

  // Credentials matched — call backend
  try {
    const response = await axios.get(`${url}/adminloggin`, { withCredentials: true })
    if (response.status === 200) {
      setIsLoggedIn(true)
      navigate('/adminpage')
    } else {
      setError('Something went wrong, please try again.')
    }
  } catch (err) {
    console.error('Admin login error:', err)
    setError('Server error. Please try again later.')
  } finally {
    setIsLoading(false)  // ✅ ALWAYS runs — stops the spinner
  }
}

  if (isLoggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-card">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Access Granted</h2>
          <p className="success-sub">Welcome back, Administrator.</p>
          <button
            className="logout-btn"
            onClick={() => { setIsLoggedIn(false); setAdminId(''); setPassword('') }}
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-card">

        {/* Header */}
        <div className="admin-header">
          <div className="lock-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="admin-title">Admin Portal</h1>
          <p className="admin-subtitle">Restricted access — authorized personnel only</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="admin-form" noValidate>

          {/* Error Banner */}
          {error && (
            <div className="error-banner" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="error-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Admin ID */}
          <div className="field-group">
            <label htmlFor="adminId" className="field-label">Admin ID</label>
            <input
              id="adminId"
              type="text"
              value={adminId}
              onChange={(e) => { setAdminId(e.target.value); setError('') }}
              placeholder="Enter your admin ID"
              className={`field-input ${error && error.toLowerCase().includes('id') ? 'input-error' : ''}`}
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="field-group">
            <label htmlFor="password" className="field-label">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="Enter your password"
                className={`field-input password-input ${error && error.toLowerCase().includes('password') ? 'input-error' : ''}`}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-btn"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-row">
                <span className="spinner" />
                Verifying...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="admin-footer">
          Contact your system administrator if you need access.
        </p>
      </div>
    </div>
  )
}

export default Admin