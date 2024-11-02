import React, { createContext, useEffect, useState } from "react";

export const webSocketContext = createContext(null);

export default function WebSocketContext({ child }) {
  const ws = new WebSocket("ws://192.168.138.55");

  return (
    <webSocketContext.Provider value={ws}>{child}</webSocketContext.Provider>
  );
}
