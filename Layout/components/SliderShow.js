import React from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";


const { width } = Dimensions.get("window");
const listBanner = [
  require("../../Image/banner_pet01.png"),
  require("../../Image/banner_pet02.png"),
  require("../../Image/banner_pet04.png"),
  require("../../Image/banner_pet03.png"),
];

export default function () {
  return (
    <Carousel
      height={180}
      width={width}
      loop
      mode="default"
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
    resizeMode: 'cover',
    height: 180,
    width: width,
    margin: 10,
    borderRadius: 20, 
  },
});