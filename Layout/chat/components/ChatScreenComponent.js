import React, { useContext, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { Text, View, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import {
  getAllMessage,
  getUser,
  onMessage,
  sendMessage,
} from "../ChatViewModel";
import { webSocketContext } from "../../websocket/WebSocketContext";
import { useRoute } from "@react-navigation/native";

export default function ChatScreenComponent() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState({});
  const websocket = useContext(webSocketContext);
  const route = useRoute(); 
  const product = route?.params?.product;

  websocket.onmessage = function (message) {
    const { data } = message;
    const json = JSON.parse(data);
    const type = json.type;

    if (type === "take care") {
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
    <ImageBackground
      style={styles.background}
    >
      <GiftedChat
        placeholder="Enter your message..."
        messages={messages}
        renderChatEmpty={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet, start chatting!</Text>
          </View>
        )}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.email,
          avatar: user.avatar,
          name: user.fullname,
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: -1 }],
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginHorizontal: 20,
  },
 
});