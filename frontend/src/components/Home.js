import { Link } from "react-router-dom";
import "./Home.css";
// import banner from "../assets/health-banner.png"; // put your uploaded image here

function Home() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <Link to="/about" className="nav-link">
          About us
        </Link>
        <Link to="/signup" className="nav-link">
          Signup
        </Link>
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </nav>

      <div>
        <Link to="/signup ">Get Started</Link>
      </div>
    </div>
  );
}

export default Home;
