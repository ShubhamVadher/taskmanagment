import axios from 'axios';
import React, { useState } from 'react';
import './Createtask.css';

const Createtask = () => {
  const [details, setDetails] = useState({
    name: "",
    members: [],
    // self: false
  });

  const [memberInput, setMemberInput] = useState("");
  const [error, setError] = useState("");

  const handleNameChange = (e) => {
    setDetails({ ...details, name: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setDetails({ ...details, self: e.target.checked });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleAddMember = () => {
    if (memberInput.trim() === "") return;

    if (!validateEmail(memberInput.trim())) {
      setError("Please enter a valid email.");
      return;
    }

    if (details.members.includes(memberInput.trim())) {
      setError("This email is already added.");
      return;
    }

    setDetails({
      ...details,
      members: [...details.members, memberInput.trim()]
    });

    setMemberInput("");
    setError("");
  };

  const handleRemoveMember = (index) => {
    const updatedMembers = details.members.filter((_, i) => i !== index);
    setDetails({ ...details, members: updatedMembers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const conf=window.confirm(`Are you sure you want to create task ${details.name} with ${details.members.length+1} members?`);
    if(!conf)return;
    if (details.name.trim() === "") {
      setError("Task name is required");
      return;
    }

    try {
      const response = await axios.post(
        "https://taskmanagment-backend-s883.onrender.com/createtask",
        details,
        { withCredentials: true }
      );

      if (response.status === 201) {
        window.alert(response.data.message);
        setDetails({ name: "", members: [], self: false });
      } else {
        window.alert(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error creating task:", err.response?.data || err.message);
      window.alert(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="create-task-container animate-fade-up">
      <h2 className="form-title">Create a New Task</h2>

      <form className="create-task-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Task Name"
            value={details.name}
            onChange={handleNameChange}
            className="form-input"
          />
        </div>

        {/* <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={details.self}
              onChange={handleCheckboxChange}
            />
            Are you part of this task?
          </label>
        </div> */}

        <div className="form-group member-group">
          <input
            type="email"
            placeholder="Member Email"
            value={memberInput}
            onChange={(e) => setMemberInput(e.target.value)}
            className="form-input"
          />
          <button type="button" onClick={handleAddMember} className="btn add-btn">
            Add
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        {details.members.length > 0 && (
          <ul className="members-list">
            {details.members.map((m, index) => (
              <li key={index} className="member-item">
                {m}
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="btn remove-btn"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className="btn submit-btn">
          Create Task
        </button>
      </form>
    </div>
  );
};

export default Createtask;
