import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";


const { width } = Dimensions.get("window");
const listBanner = [
  require("../../Image/banner_pet01.png"),
  require("../../Image/banner_pet03.png"),
  require("../../Image/banner_pet02.png"),
  require("../../Image/banner_pet05.png"),
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
const styles = StyleSheet.create({
  img: {
    resizeMode: 'contain',
    height: 200,
    width: width
  },
});