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
    <div>
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
    <div className="d-flex flex-column vh-100 container">
      <header className="bg-primary text-white text-center py-3 d-flex justify-content-between align-items-center">
        <button className="btn ms-2" onClick={() => window.history.back()}>
          <img
            src="https://static.thenounproject.com/png/65506-200.png"
            alt="Back"
            height={30}
            width={30}
            style={{ filter: "invert(1)" }}
          />
        </button>
        <span className="mx-auto">{email}</span>
        <div></div>
      </header>

      <main
        className="flex-grow-1 overflow-auto d-flex flex-column-reverse"
        id="chat-container"
      >
        <div className="py-3">
          {data.map((item) => (
            <div
              key={item._id}
              className={`${item.user._id === "admin" ? "text-end" : "text-start"
                }`}
            >
              <div>
                {item.user._id !== "admin" && (
                  <img
                    src={item.user.avatar}
                    height={40}
                    width={40}
                    className="rounded-circle me-2"
                    alt="User Avatar"
                    style={{ border: "2px solid #ddd" }}
                  />

                )}
                <p className="p-2 bg-primary text-white d-inline-block rounded-3">
                  {item.text}
                </p>
                {/* Hiển thị thời gian */}
                <small className="d-block text-muted mt-1" style={{ fontSize: "0.8rem" }}>
                  {format(new Date(item.createdAt), "HH:mm dd/MM/yyyy")}
                </small>

              </div>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <div className="input-group mb-3">
          <input
            onChange={(value) => setInputData(value.target.value)}
            type="text"
            value={inputData}
            className="form-control"
            placeholder="Enter messages..."
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
            style={{ borderRadius: "20px", padding: "10px" }}
          />
          <button
            onClick={sendMessage}
            disabled={inputData.length === 0}
            className="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            style={{ borderRadius: "20px" }}
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
