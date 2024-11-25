import React, { useContext, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { Text, View } from "react-native";
import {
  getAllMessage,
  getUser,
  onMessage,
  sendMessage,
} from "../ChatViewModel";
import { webSocketContext } from "../../websocket/WebSocketContext";

export default function ChatScreenComponent() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const websocket = useContext(webSocketContext);

  websocket.onmessage = function (message) {
    const { data } = message;
    const json = JSON.parse(data);
    const type = json.type;

    if (type == "take care") {
      const mess = json.message;
      const result = onMessage(mess);

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, result)
      );
    }
  };

  useEffect(() => {
    (async function () {
      let user = await getUser();
      let dataMessages = await getAllMessage();
      setUser(user);
      setMessages(dataMessages.reverse());
    })();
  }, []);

  const onSend = async (message) => {
    const result = await sendMessage(...message);
    if (result) {
      await websocket.send(
        JSON.stringify({
          message: message[0],
          email: "admin",
          type: "take care",
        })
      );
    }
  };

  return (
    <GiftedChat
      placeholder="Enter message..."
      messages={messages}
      renderChatEmpty={() => (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            transform: [{ scale: -1 }],
          }}
        >
          <Text>Message is empty</Text>
        </View>
      )}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user.email,
        avatar: user.avatar,
        name: user.fullname,
      }}
    />
  );
}
