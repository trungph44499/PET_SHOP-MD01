import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import json_config from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import "./css/category.css";  
import NavigationPage from "./navigation_page";

export default function AdminManagement() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [isAdd, setIsAdd] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const fullname = useRef();
  const username = useRef();
  const password = useRef();
  const [showPassword, setShowPassword] = useState(false);

  // Lấy danh sách tất cả nhân viên
  async function getAllAdmins() {
    try {
      // const { status, data: { response } } = await axios.get(`${json_config[0].url_connect}/admin`);
      const { status, data } = await axios.post(
        `${json_config[0].url_connect}/admin`
      );
      if (status === 200) {
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllAdmins();
  }, []);

  // Cập nhật hoặc thêm nhân viên
  const handleSubmit = async () => {
    if (fullname.current.value === "" || username.current.value === "" || password.current.value === "") {
      window.alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const url = isUpdate
      ? `${json_config[0].url_connect}/admin/update`
      : `${json_config[0].url_connect}/admin/add`;

    const payload = {
      id: isUpdate ? dataUpdate._id : undefined,
      fullname: fullname.current.value,
      username: username.current.value,
      password: password.current.value,
    };

    try {
      const { status, data: { response } } = await axios.post(url, payload);
      if (status === 200) {
        window.alert(response);
        await getAllAdmins();
        setIsAdd(false);
        setIsUpdate(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Mở modal để sửa nhân viên
  const openUpdateModal = (item) => {
    setDataUpdate(item);
    setIsUpdate(true);
    setIsAdd(false);
  };

  // Mở modal để thêm nhân viên mới
  const openAddModal = () => {
    setIsAdd(true);
    setIsUpdate(false);
  };

  return (
    <div className="product-container">
      <header className="product-header">
        <h1>Quản lý nhân viên</h1>
      </header>
      {/* Modal Thêm hoặc Cập nhật nhân viên */}
      {(isAdd || isUpdate) && (
        <div className="product-modal">
          <div className="product-modal-content">
            <span className="product-close" onClick={() => { setIsAdd(false); setIsUpdate(false); }}>&times;</span>
            <h2>{isUpdate ? "Cập nhật" : "Thêm mới"} nhân viên</h2>
            <div className="product-input-group">
              <span className="product-input-group-text" style={{ width: 100 }}>Họ tên</span>
              <input ref={fullname} type="text" defaultValue={isUpdate ? dataUpdate.fullname : ""} />
            </div>
            <div className="product-input-group">
              <span className="product-input-group-text" style={{ width: 100 }}>Username</span>
              <input ref={username} type="text" defaultValue={isUpdate ? dataUpdate.username : ""} disabled={isUpdate} />
            </div>
            <div className="product-input-group">
              <span className="product-input-group-text" style={{ width: 100 }}>Password</span>
              <input ref={password} type={showPassword ? "text" : "password"} defaultValue={isUpdate ? dataUpdate.password : ""} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="product-modal-footer">
              <button className="product-btn-primary" onClick={handleSubmit}>
                {isUpdate ? "Cập nhật" : "Thêm mới"}
              </button>
              <button className="product-btn btn-secondary" onClick={() => { setIsAdd(false); setIsUpdate(false); }}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nút thêm nhân viên mới */}
      <div style={{ position: "fixed", bottom: 50, right: 50 }}>
        <button
          style={{ borderRadius: 30, height: 50, width: 50 }}
          onClick={openAddModal}
        >
          <FontAwesomeIcon icon={faAdd} size="xl" />
        </button>
      </div>

      {/* Bảng danh sách nhân viên */}
      <table className="product-table">
        <thead>
          <tr>
            <th scope="col">Họ tên</th>
            <th scope="col">Username</th>
            <th scope="col">Chức vụ</th>
            <th scope="col">Trạng thái</th>
            <th scope="col">Cập nhật</th>
            <th scope="col">Chặn</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.fullname}</td>
              <td>{item.username}</td>
              <td>{item.type === "admin" ? "Admin" : "Staff"}</td>
              <td>{item.status ? "Active" : "Blocked"}</td>
              <td>
                <button
                  className="product-btn-primary"
                  onClick={() => openUpdateModal(item)}
                >
                  Update
                </button>
              </td>
              <td>
                <button
                  className="product-btn-success"
                  onClick={async () => {
                    const confirm = window.confirm(
                      `Sure ${item.status ? "lock" : "open"} ${item.fullname}`
                    );
                    if (confirm) {
                      try {
                        const {
                          status,
                          data: { response, type },
                        } = await axios.post(
                          `${json_config[0].url_connect}/admin/update`,
                          {
                            username: item.username,
                            status: !item.status,
                          }
                        );
                        if (status === 200) {
                          window.alert(response);
                          if (type) {
                            await getAllAdmins();
                          }
                        }
                      } catch (error) {
                        console.log(error);
                      }
                    }
                  }}
                >
                  {item.status ? "Lock" : "Active"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
