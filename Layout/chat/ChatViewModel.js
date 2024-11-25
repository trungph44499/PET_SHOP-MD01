import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { URL } from "../HomeScreen";

export async function getUser() {
  try {
    let email = await AsyncStorage.getItem("@UserLogin");
    const {
      status,
      data: { response },
    } = await axios.post(URL + "/users/getUser", { email });

    if (status == 200) {
      if (response.length != 0) {
        return response[0];
      }
    }
    return {};
  } catch (error) {
    console.log(error);
  }
}

export async function sendMessage(message) {
  let email = await AsyncStorage.getItem("@UserLogin");
  try {
    const { status, data } = await axios.post(URL + "/chat/add", {
      message,
      email,
    });
    if (status == 200) {
      return data;
    }
    return false;
  } catch (error) {
    console.log(error);
  }
}

export function onMessage(message) {
  const { user } = message;

  return {
    _id: message._id,
    text: message.text,
    createdAt: message.createdAt,
    user: {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
    },
  };
}

export async function getAllMessage() {
  let email = await AsyncStorage.getItem("@UserLogin");
  try {
    const { status, data } = await axios.post(URL + "/chat", { email });
    if (status == 200) {
      return data.map((item) => item.message);
    }
    return [];
  } catch (error) {
    console.log(error);
  }
}
