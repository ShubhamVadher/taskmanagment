import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Adminuseres.css';

const USERS_PER_PAGE = 10;

const Adminuseres = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const url = 'http://localhost:5000';

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  // Load all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/admin/users`, { withCredentials: true });
        setAllUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (err) {
        setError('Failed to load users.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Reset to page 1 whenever filtered list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers]);

  // Search by email
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (!searchEmail.trim()) {
      setFilteredUsers(allUsers);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.get(`${url}/admin/user`, {
        params: { email: searchEmail.trim() },
        withCredentials: true,
      });
      setFilteredUsers([response.data.user]);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('No user found with that email.');
        setFilteredUsers([]);
      } else {
        setError('Something went wrong. Try again.');
      }
    } finally {
      setSearchLoading(false);
    }
  };

  // Clear search — show all again
  const handleClear = () => {
    setSearchEmail('');
    setFilteredUsers(allUsers);
    setError('');
  };

  return (
    <div className="au-page">
      <div className="au-header">
        <h1 className="au-title">All Users</h1>
        <p className="au-subtitle">{allUsers.length} registered users</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="au-search-form">
        <div className="au-search-wrapper">
          <svg className="au-search-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchEmail}
            onChange={(e) => { setSearchEmail(e.target.value); setError(''); }}
            placeholder="Search by email..."
            className="au-search-input"
          />
          {searchEmail && (
            <button type="button" className="au-clear-btn" onClick={handleClear}>✕</button>
          )}
        </div>
        <button type="submit" className="au-search-btn" disabled={searchLoading}>
          {searchLoading ? <span className="au-spinner" /> : 'Search'}
        </button>
      </form>

      {/* Error */}
      {error && <div className="au-error">{error}</div>}

      {/* Users list */}
      {isLoading ? (
        <div className="au-loading">Loading users...</div>
      ) : (
        <>
          <div className="au-table-wrapper">
            {filteredUsers.length === 0 && !error ? (
              <div className="au-empty">No users found.</div>
            ) : (
              <table className="au-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Tasks</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => (
                    <tr key={user._id} className="au-row">
                      <td className="au-index">
                        {(currentPage - 1) * USERS_PER_PAGE + index + 1}
                      </td>
                      <td>
                        <div className="au-user-cell">
                          <div className="au-avatar">
                            {user.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <span className="au-name">{user.name}</span>
                        </div>
                      </td>
                      <td className="au-email">{user.email}</td>
                      <td className="au-tasks">{user.tasks?.length ?? 0}</td>
                      <td className="au-date">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <button
                          className="au-view-btn"
                          onClick={() => navigate(`/adminusers/${user._id}`)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="au-pagination">
              <button
                className="au-page-btn"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>

              <div className="au-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`au-page-num ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="au-page-btn"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Adminuseres;