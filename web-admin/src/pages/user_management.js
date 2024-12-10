import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import json_config from "../config.json";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { webSocketContext } from "../context/WebSocketContext";
import NavigationPage from "./navigation_page";
import { useNavigate } from "react-router-dom";
import "./css/user.css";

export default function UserManagement() {
  return (
    <div>
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const [data, setData] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const avatar = useRef();
  const fullname = useRef();
  const email = useRef();
  const password = useRef();
  const navigator = useNavigate();
  const websocket = useContext(webSocketContext);

  // WebSocket for updating user list
  useEffect(() => {
    websocket.onmessage = async (messages) => {
      const { data } = messages;
      const json = JSON.parse(data);
      if (json.type === "take care") {
        await getAllUser();
      }
    };
  }, [websocket]);

  const getAllUser = async () => {
    try {
      const { status, data } = await axios.post(
        `${json_config[0].url_connect}/users/getAllUser`
      );
      if (status === 200) {
        setData(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const handleSubmit = async () => {
    const userData = {
      avatar: avatar.current.value,
      fullname: fullname.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    try {
      const url = isUpdate
        ? `${json_config[0].url_connect}/users/update`
        : `${json_config[0].url_connect}/users/register`;

      const { status, data } = await axios.post(url, userData);

      if (status === 200) {
        window.alert(data.response);
        if (data.type) {
          await getAllUser();
        }
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setIsAdd(false);
    setIsUpdate(false);
  };

  const openUpdateModal = (user) => {
    setDataUpdate(user);
    setIsUpdate(true);
    setIsAdd(false);
  };

  const openAddModal = () => {
    setIsAdd(true);
    setIsUpdate(false);
  };

  return (
    <div className="user-container">
      <header className="user-header">
        <h1>Quản lý tài khoản người dùng</h1>
      </header>
      {/* Modal for Add or Update */}
      {(isAdd || isUpdate) && (
        <div className="user-modal">
          <div className="user-modal-content">
            {/* <span className="user-modal-close" onClick={closeModal}>&times;</span> */}
            <h2>{isUpdate ? "Cập nhật" : "Thêm mới"} người dùng</h2>
            <div className="user-input-group">
              <span className="user-input-group-text">Ảnh đại diện</span>
              <input
                ref={avatar}
                type="text"
                defaultValue={isUpdate ? dataUpdate.avatar : ""}
              />
            </div>
            <div className="user-input-group">
              <span className="user-input-group-text">Họ tên</span>
              <input
                ref={fullname}
                type="text"
                defaultValue={isUpdate ? dataUpdate.fullname : ""}
              />
            </div>
            <div className="user-input-group">
              <span className="user-input-group-text">Email</span>
              <input
                ref={email}
                type="text"
                defaultValue={isUpdate ? dataUpdate.email : ""}
                disabled={isUpdate}
              />
            </div>
            <div className="user-input-group">
              <span className="user-input-group-text">Password</span>
              <input
                ref={password}
                type={showPassword ? "text" : "password"}
                defaultValue={isUpdate ? dataUpdate.pass : ""}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="user-modal-footer">
              <button className="user-btn-primary" onClick={handleSubmit}>
                {isUpdate ? "Cập nhật" : "Thêm mới"}
              </button>
              <button className="user-btn-secondary" onClick={closeModal}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <div style={{ position: "fixed", bottom: 50, right: 50 }}>
        <button
          style={{ borderRadius: 30, height: 50, width: 50 }}
          onClick={openAddModal}>
          <FontAwesomeIcon icon={faAdd} size="xl" />
        </button>
      </div>

      {/* User List Table */}
      <table className="user-table">
        <thead>
          <tr>
            <th>Ảnh đại diện</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Cập nhật</th>
            <th>Tin nhắn</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user) => (
            <tr key={user._id}>
              <td>
                <img
                  src={user.avatar}
                  height={50}
                  width={50}
                  alt={user.fullname || "Hình ảnh user"}
                />
              </td>
              <td>{user.fullname}</td>
              <td>{user.email}</td>
              <td>
                <button className="user-btn-primary" onClick={() => openUpdateModal(user)}>
                  Cập nhật
                </button>
              </td>
              <td>
                <button
                  className="user-btn-message"
                  onClick={async () => {
                    try {
                      const { status, data } = await axios.post(
                        json_config[0].url_connect +
                        "/chat/updateNumberMessage",
                        { email: user.email }
                      );
                      if (status === 200) {
                        if (data > 0) {
                          await getAllUser();
                        }
                      }
                    } catch (error) {
                      console.log();
                    }
                    navigator("/chat-item/" + user.email);
                  }}
                >
                  Message
                  <span className="user-numberMessage">
                    {user.numberMessage}
                    <span className="user-visually-hidden">unread messages</span>
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
