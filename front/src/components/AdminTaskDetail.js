import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminTaskDetail.css';

const url = 'http://localhost:5000';

const AdminTaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`${url}/admin/task/${id}`, { withCredentials: true });
        setTask(res.data.task);
      } catch (err) {
        setError('Failed to load task.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await axios.delete(`${url}/admin/task/${id}`, { withCredentials: true });
      navigate(-1); // go back to wherever they came from
    } catch (err) {
      setDeleteError('Failed to delete task. Please try again.');
      setDeleteLoading(false);
    }
  };

  if (isLoading) return <div className="atd-loading">Loading task...</div>;
  if (error) return <div className="atd-error-page">{error}</div>;
  if (!task) return null;

  return (
    <div className="atd-page">

      {/* Back */}
      <button className="atd-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Task header card */}
      <div className="atd-header-card">
        <div className="atd-header-left">
          <div className="atd-task-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <div>
            <h1 className="atd-task-name">{task.task_name}</h1>
            <p className="atd-task-meta">
              Created by <strong>{task.created_by?.name}</strong> · {task.created_by?.email}
            </p>
          </div>
        </div>
        <div className="atd-header-right">
          <span className={`atd-status-badge ${task.completed ? 'completed' : 'pending'}`}>
            {task.completed ? '✓ Completed' : '⏳ Pending'}
          </span>
          <button className="atd-delete-btn" onClick={() => setShowConfirm(true)}>
            Delete Task
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="atd-stats-row">
        <div className="atd-stat">
          <span className="atd-stat-label">Members</span>
          <span className="atd-stat-value">{task.members?.length ?? 0}</span>
        </div>
        <div className="atd-stat">
          <span className="atd-stat-label">Updates</span>
          <span className="atd-stat-value">{task.update?.length ?? 0}</span>
        </div>
        <div className="atd-stat">
          <span className="atd-stat-label">Created</span>
          <span className="atd-stat-value">
            {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
          </span>
        </div>
        <div className="atd-stat">
          <span className="atd-stat-label">Status</span>
          <span className="atd-stat-value">{task.completed ? 'Done' : 'Active'}</span>
        </div>
      </div>

      <div className="atd-body">

        {/* Members section */}
        <div className="atd-section">
          <h2 className="atd-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
            Group Members
            <span className="atd-count-badge">{task.members?.length ?? 0}</span>
          </h2>

          {task.members?.length === 0 ? (
            <p className="atd-empty">No members in this task.</p>
          ) : (
            <div className="atd-members-grid">
              {task.members?.map((member) => {
                const isOwner = member._id === task.created_by?._id ||
                                member.email === task.created_by?.email;
                return (
                  <div key={member._id} className="atd-member-card clickable" onClick={() => navigate(`/adminusers/${member._id}`)}>
                    <div className="atd-member-avatar">
                      {member.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="atd-member-info">
                      <span className="atd-member-name">{member.name}</span>
                      <span className="atd-member-email">{member.email}</span>
                    </div>
                    <span className={`atd-role-badge ${isOwner ? 'owner' : 'member'}`}>
                      {isOwner ? 'Owner' : 'Member'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Updates section */}
        <div className="atd-section">
          <h2 className="atd-section-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Updates
            <span className="atd-count-badge">{task.update?.length ?? 0}</span>
          </h2>

          {task.update?.length === 0 ? (
            <p className="atd-empty">No updates posted yet.</p>
          ) : (
            <div className="atd-updates-list">
              {task.update?.map((upd, index) => (
                <div key={index} className="atd-update-card">
                  <div className="atd-update-header">
                    <div className="atd-update-avatar">
                      {upd.member?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <span className="atd-update-name">{upd.member?.name || 'Unknown'}</span>
                      <span className="atd-update-email">{upd.member?.email || ''}</span>
                    </div>
                    <span className="atd-update-index">#{task.update.length - index}</span>
                  </div>
                  <p className="atd-update-message">{upd.message}</p>
                </div>
              )).reverse()}
            </div>
          )}
        </div>

      </div>

      {/* Confirmation modal */}
      {showConfirm && (
        <div className="atd-modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="atd-modal" onClick={e => e.stopPropagation()}>
            <div className="atd-modal-icon">🗑️</div>
            <h3 className="atd-modal-title">Delete Task?</h3>
            <p className="atd-modal-text">
              You are about to permanently delete:
            </p>
            <p className="atd-modal-taskname">"{task.task_name}"</p>
            <ul className="atd-modal-list">
              <li>All updates will be lost</li>
              <li>Removed from all {task.members?.length} member(s)</li>
              <li>This cannot be undone</li>
            </ul>
            {deleteError && <p className="atd-modal-error">{deleteError}</p>}
            <div className="atd-modal-actions">
              <button
                className="atd-modal-cancel"
                onClick={() => setShowConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="atd-modal-confirm"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Yes, Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTaskDetail;