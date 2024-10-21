import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <button>Home</button>
      <button>Account</button>
      <button>Friends</button>
      <Link to="/ai">
        <button>AI</button>
      </Link>
      <Link to="/premium">
        <button>Premium</button>
      </Link>
    </div>
  );
};

export default HomePage;
