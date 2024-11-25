import React, { createContext, useEffect, useRef } from "react";
import ip from "../config.json";

export const webSocketContext = createContext(null);

export default function WebSocketContext({ child }) {
  const websocket = new WebSocket(`ws://${ip[0].ip}`);

  useEffect(() => {
    websocket.onopen = function () {
      console.log("websocket opened");
    };

    websocket.onclose = function () {
      console.log("Websocket closed");
    };
  }, []);

  return (
    <webSocketContext.Provider value={websocket}>
      {child}
    </webSocketContext.Provider>
  );
}
