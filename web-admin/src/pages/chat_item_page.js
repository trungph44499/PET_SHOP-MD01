import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import json_config from "../config.json";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { webSocketContext } from "../context/WebSocketContext";
import NavigationPage from "./navigation_page";
import { format } from "date-fns"; // Import date-fns để định dạng ngày tháng
import "./css/chat.css";

export default function ChatItemPage() {
  return (
    <div className="chat-page">
      <NavigationPage child={<Main />} />
    </div>
  );
}

function Main() {
  const { email } = useParams();
  const [inputData, setInputData] = useState("");
  const [data, setData] = useState([]);
  const websocket = useContext(webSocketContext);

  websocket.onmessage = function (messages) {
    const json = JSON.parse(messages.data);
    const { message, type } = json;
    console.log(message);

    if (type === "take care") {
      setData((previousMessages) => [...previousMessages, message]);
    }
  };

  useEffect(() => {
    (async function () {
      try {
        const { status, data } = await axios.post(
          json_config[0].url_connect + "/chat",
          { email }
        );
        if (status === 200) {
          setData(data.map((item) => item.message));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function sendMessage() {
    const date = new Date();
    const mess = {
      message: {
        _id: uuidv4(),
        text: inputData,
        createdAt: date.toISOString(),
        user: {
          _id: "admin",
          name: "Admin",
          avatar:
            "https://static.vecteezy.com/system/resources/previews/019/194/935/non_2x/global-admin-icon-color-outline-vector.jpg",
        },
      },
      email,
    };
    try {
      const { status, data } = await axios.post(
        json_config[0].url_connect + "/chat/add",
        mess
      );

      if (status === 200) {
        if (data) {
          await websocket.send(
            JSON.stringify({ message: mess.message, email, type: "take care" })
          );
          setInputData("");
        }
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <button className="chat-btn-back" onClick={() => window.history.back()}>
          <img
            src="https://static.thenounproject.com/png/65506-200.png"
            alt="Back"
            height={30}
            width={30}
            className="back-icon"
          />
        </button>
        <span className="chat-email">{email}</span>
        <div></div>
      </header>

      <main className="chat-content">
        <div className="chat-messages">
          {data.map((item) => (
            <div
              key={item._id}
              className={`chat-message ${item.user._id === "admin" ? "admin" : "user"}`}
            >
              <div className="message-container">
                {item.user._id !== "admin" && (
                  <img
                    src={item.user.avatar}
                    alt="User Avatar"
                    className="user-avatar"
                  />
                )}
                <div className="message-text">
                  <p>{item.text}</p>
                  <small className="chat-time">
                    {format(new Date(item.createdAt), "HH:mm dd/MM/yyyy")}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="chat-footer">
        <div className="chat-input-group">
          <input
            onChange={(value) => setInputData(value.target.value)}
            type="text"
            value={inputData}
            className="chat-input"
            placeholder="Nhập tin nhắn..."
          />
          <button
            onClick={sendMessage}
            disabled={inputData.length === 0}
            className="chat-send-btn"
          >
            Gửi
          </button>
        </div>
      </footer>
    </div>
  );
}
