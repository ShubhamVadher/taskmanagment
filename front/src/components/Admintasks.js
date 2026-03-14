import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admintasks.css';

const TASKS_PER_PAGE = 10;
const url = 'http://localhost:5000';

const Admintasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Filter state
  const [status, setStatus] = useState('all');       // all | completed | pending
  const [taskName, setTaskName] = useState('');
  const [creatorEmail, setCreatorEmail] = useState('');

  // Pagination
  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);
  const paginatedTasks = tasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  // Fetch tasks whenever filters change
  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {};
      if (status !== 'all') params.status = status;
      if (taskName.trim()) params.taskName = taskName.trim();
      if (creatorEmail.trim()) params.creatorEmail = creatorEmail.trim();

      const response = await axios.get(`${url}/admin/tasks`, {
        params,
        withCredentials: true,
      });
      setTasks(response.data.tasks);
      setCurrentPage(1);
    } catch (err) {
      setError('Failed to load tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Apply filters
  const handleApply = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  // Reset all filters
  const handleReset = () => {
    setStatus('all');
    setTaskName('');
    setCreatorEmail('');
    // fetch with cleared values directly
    setIsLoading(true);
    axios.get(`${url}/admin/tasks`, { withCredentials: true })
      .then(res => { setTasks(res.data.tasks); setCurrentPage(1); })
      .catch(() => setError('Failed to load tasks.'))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="at-page">
      <div className="at-header">
        <h1 className="at-title">All Tasks</h1>
        <p className="at-subtitle">{tasks.length} tasks found</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleApply} className="at-filters">

        {/* Status toggle */}
        <div className="at-status-group">
          {['all', 'pending', 'completed'].map((s) => (
            <button
              key={s}
              type="button"
              className={`at-status-btn ${status === s ? 'active' : ''} ${s}`}
              onClick={() => setStatus(s)}
            >
              {s === 'all' ? 'All' : s === 'pending' ? 'Pending' : 'Completed'}
            </button>
          ))}
        </div>

        {/* Task name search */}
        <div className="at-input-wrapper">
          <svg className="at-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Search task name..."
            className="at-input"
          />
          {taskName && (
            <button type="button" className="at-clear-x" onClick={() => setTaskName('')}>✕</button>
          )}
        </div>

        {/* Creator email search */}
        <div className="at-input-wrapper">
          <svg className="at-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            type="text"
            value={creatorEmail}
            onChange={(e) => setCreatorEmail(e.target.value)}
            placeholder="Search by creator email..."
            className="at-input"
          />
          {creatorEmail && (
            <button type="button" className="at-clear-x" onClick={() => setCreatorEmail('')}>✕</button>
          )}
        </div>

        {/* Buttons */}
        <div className="at-filter-actions">
          <button type="submit" className="at-apply-btn">Apply</button>
          <button type="button" className="at-reset-btn" onClick={handleReset}>Reset</button>
        </div>
      </form>

      {/* Error */}
      {error && <div className="at-error">{error}</div>}

      {/* Table */}
      {isLoading ? (
        <div className="at-loading">Loading tasks...</div>
      ) : (
        <>
          <div className="at-table-wrapper">
            {tasks.length === 0 ? (
              <div className="at-empty">No tasks match your filters.</div>
            ) : (
              <table className="at-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Task Name</th>
                    <th>Created By</th>
                    <th>Members</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTasks.map((task, index) => (
                    <tr key={task._id} className="at-row">
                      <td className="at-index">
                        {(currentPage - 1) * TASKS_PER_PAGE + index + 1}
                      </td>
                      <td className="at-taskname">{task.task_name}</td>
                      <td>
                        <div className="at-creator">
                          <div className="at-avatar">
                            {task.created_by?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="at-creator-name">{task.created_by?.name || 'N/A'}</div>
                            <div className="at-creator-email">{task.created_by?.email || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="at-members">{task.members?.length ?? 0}</td>
                      <td>
                        <span className={`at-badge ${task.completed ? 'completed' : 'pending'}`}>
                          {task.completed ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="at-date">
                        {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td>
                        <button
                          className="at-view-btn"
                          onClick={() => navigate(`/admintasks/${task._id}`)}
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
            <div className="at-pagination">
              <button
                className="at-page-btn"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                ← Prev
              </button>
              <div className="at-page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`at-page-num ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                className="at-page-btn"
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

export default Admintasks;