import axios from "axios";
import { URL } from "../HomeScreen";

export const getListClassify = async (type) => {
  var data = [];
  try {
    const {
      status,
      data: { response },
    } = await axios.get(`${URL}/products`);
    if (status == 200) {
      // console.log("type: ",type);
      
      data = response.filter((item) => item.type._id === type);
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
