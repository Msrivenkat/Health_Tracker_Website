import { Link } from "react-router-dom";
// import React from "react";
import "./About.css";
import trackerImg from "../assets/health-banner.png"; // your existing image
import stepsImg from "../assets/steps.png"; // optional extra images
import dietImg from "../assets/diet.png";
import statsImg from "../assets/stats.png";

function About() {
  return (
    <div className="about-container">
      <nav className="navbar">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/signup" className="nav-link">
          Signup
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </nav>
      <section className="about-hero">
        <div className="about-text">
          <h1>About Health Tracker</h1>
          <p>
            Health Tracker is your personal companion for maintaining a balanced
            and active lifestyle. Our goal is to help you monitor your fitness,
            diet, and well-being, effortlessly — all in one place.
          </p>
        </div>
        <div className="about-image">
          <img src={trackerImg} alt="Health Tracker App Overview" />
        </div>
      </section>

      <section className="about-features">
        <h2>Why Choose Health Tracker?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <img src={stepsImg} alt="Steps Tracking" />
            <h3>Steps & Activity Tracking</h3>
            <p>
              Track your daily steps, calories burnt, and set achievable
              activity goals.
            </p>
          </div>

          <div className="feature-card">
            <img src={dietImg} alt="Diet Monitoring" />
            <h3>Food & Diet Monitoring</h3>
            <p>
              Log your meals and know the nutritional values for smarter eating
              habits.
            </p>
          </div>

          <div className="feature-card">
            <img src={statsImg} alt="Health Stats" />
            <h3>Progress Insights</h3>
            <p>
              Visualize your health data and stay motivated by your fitness
              progress.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
