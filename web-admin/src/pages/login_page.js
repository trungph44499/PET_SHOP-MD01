import axios from "axios";
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import url_config from "../config.json";
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
    <div className="m-2 d-flex flex-column justify-content-center align-items-center vh-100">
      <h2>Đăng nhập</h2>
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
        Đăng nhập
      </button>
    </div>
  );
}
