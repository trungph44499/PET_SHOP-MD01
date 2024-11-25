import React from "react";
import WebSocketContext from "../websocket/WebSocketContext";
import ChatScreenComponent from "./components/ChatScreenComponent";

export default function ChatScreen() {
  return <WebSocketContext child={<ChatScreenComponent />} />;
}

