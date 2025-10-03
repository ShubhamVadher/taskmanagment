import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
     
      <header id="home-header" className="home-header animate-fade-down">
        <h1 className='app-name'>TaskFlow</h1>
        <h3 className="app-title">Task Management App</h3>
        <p className="app-subtitle">Organize, Track, and Complete Your Tasks Effortlessly</p>
      </header>

   
      <main id="home-main" className="home-main">
        <section id="about" className="home-section about-section animate-fade-up">
          <h2 className="section-title">About</h2>
          <p className="section-text">
            This is a modern task management app where you can add tasks, track updates, and mark them as completed. Everything is designed for simplicity and efficiency.
          </p>
        </section>

        <section id="getting-started" className="home-section getting-started-section animate-fade-up delay-1">
          <h2 className="section-title">Getting Started</h2>
          <p className="section-text">
            Start by navigating to "Create Task" to create a new task, or "Tasks" to see all tasks assigned to you.
          </p>
        </section>
      </main>

    
      <footer id="home-footer" className="home-footer animate-fade-up delay-2">
        <p className="footer-text">&copy; 2025 TaskFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
