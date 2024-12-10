import React, { useCallback } from "react";
import { StyleSheet, View, Image, Dimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const listBanner = [
  require("../../Image/banner_pet01.png"),
  require("../../Image/banner_pet02.png"),
  require("../../Image/banner_pet04.png"),
  require("../../Image/banner_pet03.png"),
];

export default function BannerCarousel() {
  // Hàm renderItem với useCallback để tối ưu hóa việc render lại
  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.slide}>
        <Image style={styles.img} source={item} />
      </View>
    ),
    []
  );

  return (
    <Carousel
      height={180}
      width={width}
      loop
      mode="default"
      autoPlay={true}
      data={listBanner}
      scrollAnimationDuration={1000}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
  img: {
    resizeMode: "cover",
    height: 180,
    width: width,
    margin: 10,
    borderRadius: 20,
  },
});
