import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./loginRegister/Login";
import Register from "./loginRegister/Register";
import HomePage from "./Home/HomePage";
import AiChatPage from "./AiChat/AiChat";
import PremiumPage from "./premium/premium";

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in (via localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setIsLoggedIn(true); // User is logged in, update state
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // Mark user as logged in upon successful login
  };

  return (
    <Router>
      <div>
        <h1>User Authentication</h1>
        {!isLoggedIn ? (
          <>
            <button onClick={() => setIsLogin(true)}>Login</button>
            <button onClick={() => setIsLogin(false)}>Register</button>
            {isLogin ? (
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Register />
            )}
          </>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ai" element={<AiChatPage />} />
            <Route path="/premium" element={<PremiumPage />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
