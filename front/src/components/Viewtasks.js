import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie"; 
import { jwtDecode } from "jwt-decode";
import './Viewtasks.css'

const Viewtasks = () => {
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    creator: "all",
    sort: "oldest", 
  });
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);

  useEffect(() => {
    const token = Cookies.get("Token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.id);
        setName(decoded.name);
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/gettasks", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setTasks(response.data.tasks);
        } else {
          window.alert(response.data.message);
        }
      } catch (err) {
        console.log("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const handleUpdate = async (id, e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Update message cannot be empty!");
      return;
    }
    const conf = window.confirm("Are you sure you want to mark an update?");
    if (!conf) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/updatetask/${id}`,
        { message },
        { withCredentials: true }
      );
      if (res.status === 200) {
        alert("Update added!");
        setMessage("");
        setTasks((prev) =>
          prev.map((task) =>
            task._id === id
              ? {
                  ...task,
                  update: [
                    ...task.update,
                    {
                      message,
                      time: new Date(),
                      member: { name: name },
                    },
                  ],
                }
              : task
          )
        );
      }
    } catch (err) {
      console.error("Error updating task:", err.response?.data || err.message);
    }
  };

  const handle_complet = async (id) => {
    const conf = window.confirm("Are you sure you want to mark this as Completed?");
    if (!conf) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/complete/${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        window.alert("Marked as completed");
        setTasks((prev) =>
          prev.map((task) =>
            task._id === id ? { ...task, completed: true } : task
          )
        );
      } else {
        window.alert(response.data.message);
      }
    } catch (err) {
      console.error("Error completing task:", err);
    }
  };

  const toggleExpand = (taskId) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const filteredTasks = tasks
    .filter((task) => {
      if (filters.status === "completed" && !task.completed) return false;
      if (filters.status === "pending" && task.completed) return false;
      if (filters.creator === "mine" && task.created_by?._id !== userId) return false;
      if (filters.creator === "others" && task.created_by?._id === userId) return false;
      return true;
    })
    .slice();

  if (filters.sort === "newest") {
    filteredTasks.reverse();
  }

  return (
    <div id="viewtasks-container" className="viewtasks-container">
     
      <div id="filters" className="filters">
        <label htmlFor="status-select">Status: </label>
        <select
          id="status-select"
          className="filter-select"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All</option>
          <option value="completed">Completed ✅</option>
          <option value="pending">Pending ❌</option>
        </select>

        <label htmlFor="creator-select">Creator: </label>
        <select
          id="creator-select"
          className="filter-select"
          value={filters.creator}
          onChange={(e) => setFilters({ ...filters, creator: e.target.value })}
        >
          <option value="all">All</option>
          <option value="mine">Created by Me</option>
          <option value="others">Created by Others</option>
        </select>

        <label htmlFor="sort-select">Sort: </label>
        <select
          id="sort-select"
          className="filter-select"
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="oldest">Oldest First</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p id="no-tasks" className="no-tasks">No tasks found.</p>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task._id}
            id={`task-${task._id}`}
            className={`task-card ${expandedTask === task._id ? "expanded" : ""}`}
          >
            <div
              className="task-header"
              onClick={() => toggleExpand(task._id)}
            >
              {task.task_name}{" "}
              <span className="task-creator">
                (Created by: {task.created_by?.name || "Unknown"})
              </span>
            </div>

            {expandedTask === task._id && (
              <div className="task-details">
                <details className="task-members">
                  <summary>Members</summary>
                  <ul>
                    {task.members.map((m) => (
                      <li key={m._id} className="member-item">
                        {m.name} ({m.email})
                      </li>
                    ))}
                  </ul>
                </details>

                <details className="task-updates">
                  <summary>Updates</summary>
                  {task.update.length === 0 ? (
                    <p className="no-updates">No updates yet.</p>
                  ) : (
                    <ul>
                      {task.update.map((u, i) => (
                        <li key={i} className="update-item">
                          <b>{u.member?.name || "Unknown"}:</b> {u.message}{" "}
                          <span className="update-time">
                            ({new Date(u.time).toLocaleString()})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {!task.completed && (
                    <form
                      id={`update-form-${task._id}`}
                      className="update-form"
                      onSubmit={(e) => handleUpdate(task._id, e)}
                    >
                      <input
                        id={`update-input-${task._id}`}
                        className="update-input"
                        placeholder="Update"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="btn submit-btn"
                        id={`submit-btn-${task._id}`}
                      >
                        Submit
                      </button>
                    </form>
                  )}
                </details>

                <div className="task-status">
                  <b>Status:</b>{" "}
                  {task.completed ? (
                    <span className="completed">Completed ✅</span>
                  ) : (
                    <span className="pending">Pending ❌</span>
                  )}
                  {!task.completed && task.created_by?._id === userId && (
                    <button
                      className="btn complete-btn"
                      id={`complete-btn-${task._id}`}
                      onClick={() => handle_complet(task._id)}
                    >
                      Mark As Completed
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Viewtasks;
