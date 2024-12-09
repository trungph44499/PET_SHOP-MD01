import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import url_config from "../config.json";
import "../pages/css/login.css"; // Import the CSS file
import Swal from "sweetalert2";  // Import SweetAlert2

export default function LoginPage() {
  const navigation = useNavigate();
  const username = useRef();
  const password = useRef();
  const btnLogin = useRef();

  async function loginForm() {
    try {
      const response = await axios.post(url_config[0].url_connect + "/admin/login", {
        username: username.current.value,
        password: password.current.value,
      });

      const { status, data: { isAdmin, response: message, type, id } } = response;

      if (status === 200) {
        if (message === "Đăng nhập thất bại!") {
          Swal.fire({
            title: message,
            icon: 'error',
            confirmButtonText: 'OK',
            position: 'top',
          }).then(() => {
            if (type) {
              if (id) {
                window.localStorage.setItem("@adminId", id);
              }
              window.localStorage.setItem("@isAdmin", isAdmin);
              navigation("/user", { replace: true });
            }
          });
        } else {
          Swal.fire({
            title: message,
            icon: 'success',
            confirmButtonText: 'OK',
            position: 'top',
          }).then(() => {
            if (type) {
              if (id) {
                window.localStorage.setItem("@adminId", id);
              }
              window.localStorage.setItem("@isAdmin", isAdmin);
              navigation("/user", { replace: true });
            }
          });
        }
      }
    } catch (error) {
      Swal.fire({
        title: 'Đăng nhập thất bại!',
        text: 'Vui lòng kiểm tra lại thông tin đăng nhập.',
        icon: 'error',
        confirmButtonText: 'Thử lại',
        position: 'top',
      });
    }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-image">
          <img src={require('../Image/logo_pet.png')} height={500} width={500} alt="Logo" />
        </div>
        <div className="login-box">
          <h2>Đăng nhập hệ thống</h2>
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
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}