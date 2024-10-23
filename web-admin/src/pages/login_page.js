import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigation = useNavigate();

  function loginForm() {
    navigation("/user");
  }

  return (
    <div className="m-2 d-flex flex-column justify-content-center align-items-center vh-100">
      <h2>Login</h2>
      <input className="col-md-2 mb-2" placeholder="Username" />
      <input className="col-md-2 mb-2" type="password" placeholder="Password" />
      <button onClick={loginForm} className="col-md-1">
        Login
      </button>
    </div>
  );
}
