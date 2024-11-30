import AsyncStorage from "@react-native-async-storage/async-storage";
import { URL } from "../HomeScreen";
import axios from "axios";

export async function getAllHistoryPay(type) {
  try {
    const email = await AsyncStorage.getItem("@UserLogin");

    const { status, data } = await axios.get(`${URL}/pay/get-type`, {
      params: { email, type },
    });

    if (status == 200) {
      return data;
    }
    return [];
  } catch (error) {
    console.log(error);
  }
}
