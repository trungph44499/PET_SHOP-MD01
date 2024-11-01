import React from "react";
import { Image,TouchableOpacity } from "react-native";

export default function CheckBoxCustom({ onChangeCheckBox, value }) {
  return (
    <TouchableOpacity onPress={onChangeCheckBox}>
      <Image
        style={{ width: 20, height: 20 }}
        source={
          value
            ? require("../../Image/check-box.png")
            : require("../../Image/square.png")
        }
      />
    </TouchableOpacity>
  );
}
