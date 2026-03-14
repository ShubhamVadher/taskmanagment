import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminUserDetail.css';

const TASKS_PER_PAGE = 10;
const url = 'http://localhost:5000';

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/admin/user/${id}`, { withCredentials: true });
        setUser(res.data.user);
      } catch (err) {
        setError('Failed to load user.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await axios.delete(`${url}/admin/user/${id}`, { withCredentials: true });
      navigate('/adminusers');
    } catch (err) {
      setDeleteError('Failed to delete user. Please try again.');
      setDeleteLoading(false);
    }
  };

  // Pagination
  const tasks = user?.tasks || [];
  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  if (isLoading) return <div className="aud-loading">Loading user...</div>;
  if (error) return <div className="aud-error-page">{error}</div>;
  if (!user) return null;

  return (
    <div className="aud-page">

      {/* Back button */}
      <button className="aud-back-btn" onClick={() => navigate('/adminusers')}>
        ← Back to Users
      </button>

      {/* User info card */}
      <div className="aud-profile-card">
        <div className="aud-avatar">
          {user.name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div className="aud-profile-info">
          <h1 className="aud-name">{user.name}</h1>
          <p className="aud-email">{user.email}</p>
          <div className="aud-meta">
            <div className="aud-meta-item">
              <span className="aud-meta-label">Total Tasks</span>
              <span className="aud-meta-value">{tasks.length}</span>
            </div>
            <div className="aud-meta-item">
              <span className="aud-meta-label">Owned Tasks</span>
              <span className="aud-meta-value">
                {tasks.filter(t => t.created_by?._id === user._id || t.created_by?.email === user.email).length}
              </span>
            </div>
            <div className="aud-meta-item">
              <span className="aud-meta-label">Joined</span>
              <span className="aud-meta-value">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="aud-meta-item">
              <span className="aud-meta-label">Completed</span>
              <span className="aud-meta-value">
                {tasks.filter(t => t.completed).length}
              </span>
            </div>
          </div>
        </div>

        {/* Remove user button */}
        <button className="aud-remove-btn" onClick={() => setShowConfirm(true)}>
          Remove User
        </button>
      </div>

      {/* Tasks section */}
      <div className="aud-tasks-section">
        <h2 className="aud-tasks-title">
          Tasks
          <span className="aud-tasks-count">{tasks.length}</span>
        </h2>

        {tasks.length === 0 ? (
          <div className="aud-empty">This user has no tasks.</div>
        ) : (
          <>
            <div className="aud-table-wrapper">
              <table className="aud-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Name</th>
                    <th>Role</th>
                    <th>Members</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((task, index) => {
                    const isOwner = task.created_by?.email === user.email;
                    return (
                      <tr key={task._id} className="aud-row">
                        <td className="aud-index">
                          {(currentPage - 1) * TASKS_PER_PAGE + index + 1}
                        </td>
                        <td className="aud-taskname">{task.task_name}</td>
                        <td>
                          <span className={`aud-role-badge ${isOwner ? 'owner' : 'member'}`}>
                            {isOwner ? 'Owner' : 'Member'}
                          </span>
                        </td>
                        <td className="aud-members">{task.members?.length ?? 0}</td>
                        <td>
                          <span className={`aud-status-badge ${task.completed ? 'completed' : 'pending'}`}>
                            {task.completed ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                        <td className="aud-date">
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td>
                          <button
                            className="aud-view-btn"
                            onClick={() => navigate(`/admintasks/${task._id}`)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="aud-pagination">
                <button
                  className="aud-page-btn"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                >
                  ← Prev
                </button>
                <div className="aud-page-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`aud-page-num ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  className="aud-page-btn"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="aud-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="aud-modal" onClick={e => e.stopPropagation()}>
            <div className="aud-modal-icon">⚠️</div>
            <h3 className="aud-modal-title">Remove User?</h3>
            <p className="aud-modal-text">
              This will permanently delete <strong>{user.name}</strong> and:
            </p>
            <ul className="aud-modal-list">
              <li>Delete all tasks they created</li>
              <li>Remove them from all tasks they are a member of</li>
              <li>This action cannot be undone</li>
            </ul>
            {deleteError && <p className="aud-modal-error">{deleteError}</p>}
            <div className="aud-modal-actions">
              <button
                className="aud-modal-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="aud-modal-confirm"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Removing...' : 'Yes, Remove User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDetail;