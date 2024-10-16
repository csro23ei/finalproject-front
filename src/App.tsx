

import React, { useState } from "react";
import Login from "./loginRegister/Login";
import Register from "./loginRegister/Register.tsx";

const App: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  return (
    <div>
      <h1>User Authentication</h1>
      <button onClick={() => setIsLogin(true)}>Login</button>
      <button onClick={() => setIsLogin(false)}>Register</button>
      {isLogin ? <Login /> : <Register />}
    </div>
  );
};
// funkar det

export default App;
