import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Home.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      try {
        await fetch("http://localhost:8080/user/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username }),
        });
      } catch (error) {
        console.error("Failed to log out on the server", error);
      }
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <button>Home</button>
      <button>Account</button>
      <Link to="/friends">
        <button>Friends</button>
      </Link>
      <Link to="/ai"> {/* Make the AI button a Link */}
        <button>AI</button>
      </Link>
      <Link to="/premium">
        <button>Premium</button>
      </Link>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;
