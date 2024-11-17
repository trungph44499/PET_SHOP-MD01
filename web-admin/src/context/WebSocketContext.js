import React, { createContext, useEffect, useRef } from "react";
import ip from "../config.json";

export const webSocketContext = createContext(null);

export default function WebSocketContext({ child }) {
  const wsRef = useRef(null); // Dùng useRef để giữ WebSocket instance ổn định

  useEffect(() => {
    // Tạo WebSocket khi component mount
    wsRef.current = new WebSocket(`ws://${ip[0].ip}`);

    // Kiểm tra nếu WebSocket đã được tạo thành công
    if (wsRef.current) {
      wsRef.current.onopen = function () {
        console.log("websocket opened");
      };

      wsRef.current.onmessage = function (message) {
        console.log("Received message:", message.data);
      };

      // Đảm bảo đóng kết nối WebSocket khi component unmount
      return () => {
        if (wsRef.current) {
          wsRef.current.close();
          console.log("websocket closed");
        }
      };
    }
  }, []); // Chạy một lần khi component mount

  return (
    <webSocketContext.Provider value={wsRef.current}>
      {child}
    </webSocketContext.Provider>
  );
}
