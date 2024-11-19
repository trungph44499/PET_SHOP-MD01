import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import url_config from "../config.json";
import "../login.css"; // Import the CSS file

export default function LoginPage() {
  const navigation = useNavigate();
  const username = useRef();
  const password = useRef();
  const btnLogin = useRef();

  async function loginForm() {
    try {
      const {
        status,
        data: { isAdmin, response, type },
      } = await axios.post(url_config[0].url_connect + "/admin/login", {
        username: username.current.value,
        password: password.current.value,
      });

      if (status == 200) {
        window.alert(response);
        if (type) {
          window.localStorage.setItem("@isAdmin", isAdmin);
          navigation("/user", { replace: true });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>
        <input ref={username} className="login-input" placeholder="Tên đăng nhập" />
        <input
          ref={password}
          className="login-input"
          type="password"
          placeholder="Mật khẩu"
        />
        <button
          ref={btnLogin}
          onClick={loginForm}
          className="login-button"
        >
          Login
        </button>
      </div>
    </div>
  );
}
