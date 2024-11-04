import React, { createContext, useEffect } from "react";
import ip from "../config.json";

export const webSocketContext = createContext(null);

export default function WebSocketContext({ child }) {
  const ws = new WebSocket(`ws://${ip[0].ip}`);

  useEffect(() => {
    ws.onopen = function () {
      console.log("websocket opened");
    };
  }, []);

  return (
    <webSocketContext.Provider value={ws}>{child}</webSocketContext.Provider>
  );
}
