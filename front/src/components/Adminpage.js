import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Adminpage.css'

const Adminpage = () => {
  const navigate = useNavigate()

  return (
    <div className="ap-page">
      <div className="ap-welcome">
        <h1 className="ap-title">Welcome, Admin</h1>
        <p className="ap-subtitle">What would you like to manage today?</p>
      </div>

      <div className="ap-cards">
        <div className="ap-card" onClick={() => navigate('/admintasks')}>
          <div className="ap-card-icon tasks">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <h2 className="ap-card-title">All Tasks</h2>
          <p className="ap-card-desc">View, filter and manage all tasks in the system.</p>
          <span className="ap-card-link">Go to Tasks →</span>
        </div>

        <div className="ap-card" onClick={() => navigate('/adminusers')}>
          <div className="ap-card-icon users">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <h2 className="ap-card-title">All Users</h2>
          <p className="ap-card-desc">Browse, search and remove registered users.</p>
          <span className="ap-card-link">Go to Users →</span>
        </div>
      </div>
    </div>
  )
}

export default Adminpage