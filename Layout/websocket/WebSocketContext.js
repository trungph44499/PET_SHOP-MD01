import React, { createContext } from "react";
import ip from "../config/ipconfig.json";

export const webSocketContext = createContext(null);

export default function WebSocketContext({ child }) {
  const ws = new WebSocket(`ws://${ip.ip}`);

  return (
    <webSocketContext.Provider value={ws}>{child}</webSocketContext.Provider>
  );
}
