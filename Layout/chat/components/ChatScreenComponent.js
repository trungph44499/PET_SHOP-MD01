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
  const product = route?.params?.product || null;

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
    if (!price || isNaN(price)) return "0";
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
    <ImageBackground style={styles.background}>
      {/* Hiển thị sản phẩm */}
      {!product ? (
        <Text style={styles.noProductText}>No product details available</Text>
      ) : (
        <View style={styles.productContainer}>
          {product.img && (
            <Image
              source={{ uri: product.img }}
              style={styles.productImage}
              resizeMode="contain"
            />
          )}
          <Text style={styles.productTitle}>{product.name}</Text>
          <Text style={styles.productPrice}>
            Giá: {product.size && product.size[0]?.price ? numberUtils(product.size[0].price) : "N/A"} VND
          </Text>
        </View>
      )}

      {/* Chat UI */}
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
  productContainer: {
    position: "absolute", // Hiển thị cố định
    top: 10, // Đặt vị trí phía trên
    left: 0,
    right: 0,
    alignItems: "center", // Căn giữa
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 8,
    zIndex: 1, // Đảm bảo xuất hiện trên chat
    elevation: 5, // Bóng đổ (trên Android)
    shadowColor: "#000", // Bóng đổ (trên iOS)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
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

