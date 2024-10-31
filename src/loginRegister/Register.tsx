import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate(); // Initialize navigate

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        setMessage("Registration successful! You can now log in.");
      } else {
        setMessage("Registration failed: Username may already exist.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration error: Something went wrong.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
      <button onClick={() => navigate("/login")}>Login</button> {/* Navigate to Login */}
    </div>
  );
};

export default Register;
