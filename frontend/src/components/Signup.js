import { useState } from "react";
import axios from "axios";
import "./Auth.css";
import { Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:3001/signup", form)
      .then((res) => {
        alert(res.data.message);

        // 🔥 CLEAR THE INPUT FIELDS
        setForm({
          name: "",
          email: "",
          password: "",
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth-page">
      <div className="top-right-links">
        <Link to="/">Home</Link>
        <Link to="/About">About us</Link>
      </div>

      <div className="auth-box">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={form.name} // ⭐ controlled input
            required
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email} // ⭐ controlled input
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password} // ⭐ controlled input
            required
          />

          <button type="submit" className="auth-btn">
            Sign Up
          </button>

          <Link to="/Login" style={{ color: "#000000ff" }}>
            Registered Please login...
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
