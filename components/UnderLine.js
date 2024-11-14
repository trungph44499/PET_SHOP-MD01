import { Dimensions, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";

const UnderLine = ({ value, color, value2, color2 }) => {
  return (
    <View
      style={{
        borderBottomColor: color,
        borderBottomWidth: 2,
        paddingBottom: 5,
      }}
    >
      <Text style={{ color: color2, fontSize: 16, fontWeight: "bold" }}>
        {value || ""}
      </Text>
      {value2 != null ? <Text style={{ color }}>{value2 || ""}</Text> : null}
    </View>
  );
};

export default UnderLine;
