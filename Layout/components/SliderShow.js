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
  // Hàm renderItem tối ưu hóa với useCallback
  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.slide}>
        <Image style={styles.img} source={item} />
      </View>
    ),
    [] // Không có phụ thuộc bên ngoài cần theo dõi
  );

  return (
    <Carousel
      height={180}
      width={width}
      loop
      mode="default"
      autoPlay={true}
      autoPlayInterval={5000} // Thời gian giữa mỗi lần autoplay (mặc định là 5s)
      data={listBanner}
      scrollAnimationDuration={600} // Thời gian chuyển tiếp mượt mà hơn
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  slide: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden", // Đảm bảo góc của hình ảnh không bị tràn ra ngoài
  },
  img: {
    resizeMode: "cover",
    height: 180,
    width: width - 20, // Giảm chiều rộng để có khoảng cách giữa các banner
    marginHorizontal: 10, // Tạo khoảng cách giữa các slide
    borderRadius: 20,
  },
});
