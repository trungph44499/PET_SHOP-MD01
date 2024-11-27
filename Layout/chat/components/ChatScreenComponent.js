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

  const numberUtils = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
      {/* <View>
        {product && (
          <TouchableOpacity
            style={styles.productContainer}
          >
            {product.img && (
              <Image 
                source={{ uri: product.img }} 
                style={styles.productImage}
                resizeMode="contain"
              />
            )}
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.productPrice}>
              Giá: {numberUtils(product.size[0].price)} VND
            </Text>
          </TouchableOpacity>
        )}
      </View> */}
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
  productContainer: {
    backgroundColor: "#f8f9fa",
    padding: 30,
    margin: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});
