import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const styles = StyleSheet.create({
  img: {
    resizeMode: "center",
    height: 200,
    width: "auto",
  },
});
const { width } = Dimensions.get("window");
const listBanner = [
  require("../../Image/banner_pet01.png"),
  require("../../Image/banner_pet01.png"),
  require("../../Image/banner_pet01.png"),
  require("../../Image/banner_pet01.png"),
];

export default function () {
  return (
    <Carousel
      height={200}
      width={width}
      loop
      mode="parallax"
      autoPlay={true}
      data={listBanner}
      scrollAnimationDuration={1000}
      renderItem={({ _, item }) => (
        <View>
          <Image style={styles.img} source={item} />
        </View>
      )}
    />
  );
}
