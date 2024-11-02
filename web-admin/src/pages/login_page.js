import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import url_config from "../config.json";

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
    <div className="m-2 d-flex flex-column justify-content-center align-items-center vh-100">
      <h2>Login</h2>
      <input ref={username} className="col-md-2 mb-2" placeholder="Username" />
      <input
        ref={password}
        className="col-md-2 mb-2"
        type="password"
        placeholder="Password"
      />
      <button
        ref={btnLogin}
        onClick={loginForm}
        className="col-md-1 btn btn-success"
      >
        Login
      </button>
    </div>
  );
}
