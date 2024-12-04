import axios from "axios";
import { URL } from "../HomeScreen";

export const getListClassify = async (type, animals) => {
  var data = [];
  try {
    const {
      status,
      data: { response },
    } = await axios.get(`${URL}/products`);
    if (status == 200) {
      // console.log("animals: ",animals);
      
      data = response.filter(
        (item) => item.type._id === type && item.animals === animals
      );
      
    }
    return data;
  } catch (err) {
    console.log(err);
  }
};
