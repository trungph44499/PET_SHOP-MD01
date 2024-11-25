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
      const {
        status,
        data: { isAdmin, response, type },
      } = await axios.post(url_config[0].url_connect + "/admin/login", {
        username: username.current.value,
        password: password.current.value,
      });

      if (status === 200) {
        if(response === "Đăng nhập thất bại!"){
          Swal.fire({       
            title: response,  // Hiển thị thông báo trả về từ server      
            icon: 'error',  // Biểu tượng lỗi
            confirmButtonText: 'OK',  // Nút xác nhận
            position: 'top',  // Chỉnh vị trí xuất hiện của hộp thoại
          }).then(() => {
            if (type) {
              window.localStorage.setItem("@isAdmin", isAdmin);
              navigation("/user", { replace: true }); // Chuyển hướng sau khi đăng nhập
            }
          });
        }else{
          Swal.fire({       
            title: response,  // Hiển thị thông báo trả về từ server      
            icon: 'success', // Biểu tượng thành công
            confirmButtonText: 'OK',  // Nút xác nhận
            position: 'top',  // Chỉnh vị trí xuất hiện của hộp thoại
          }).then(() => {
            if (type) {
              window.localStorage.setItem("@isAdmin", isAdmin);
              navigation("/user", { replace: true }); // Chuyển hướng sau khi đăng nhập
            }
          });
        }
        }
    } catch (error) {
      // Thông báo lỗi
      Swal.fire({
        title: 'Đăng nhập thất bại!',
        text: 'Vui lòng kiểm tra lại thông tin đăng nhập.',
        icon: 'error',  // Biểu tượng lỗi
        confirmButtonText: 'Thử lại',
        position: 'top',  // Chỉnh vị trí xuất hiện của hộp thoại
      });
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
          Đăng nhập
        </button>
      </div>
    </div>
  );
}