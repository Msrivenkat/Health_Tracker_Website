import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Login() {
  const [user, setUser] = useState({ name: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/login", user)
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("username", res.data.name);
          navigate("/Dashboard");
        } else {
          alert(res.data.message);
        }
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
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            name="name"
            placeholder="name"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn">
            Login
          </button>
          <Link to="/Signup" style={{ color: "#000000ff" }}>
            Don't have an Account register here ...
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
