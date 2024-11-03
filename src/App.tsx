import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./Home/HomePage";
import FriendsPage from "./Friend/friendspage";
import LoginPage from "./loginRegister/Login";
import Register from "./loginRegister/Register";
import AiChatPage from "./AiChat/AiChat"; // Ensure you import AiChatPage
import ChatPage from "./Friend/ChatPage";


(window as any).global = window;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!storedUser);
  }, []);

  return (
    <Router>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/ai" element={<AiChatPage />} />
            <Route path="/chat/:friendUsername" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
