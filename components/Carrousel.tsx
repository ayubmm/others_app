import React, { useState } from "react";
import {
  View,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  ImageSourcePropType,
  ViewStyle,
} from "react-native";

const { width } = Dimensions.get("window");

interface ImageData {
  id: string;
  source: ImageSourcePropType;
}

interface CarouselProps {
  images: ImageData[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const currentIndex = Math.floor(
      event.nativeEvent.contentOffset.x / slideSize
    );
    setActiveIndex(currentIndex);
  };

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image
              source={item.source}
              style={{ width: "100%", height: 180, marginTop: 30 }}
              resizeMode="cover"
            />
          </View>
        )}
        // Track scrolling to update active index
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Dots container */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    width: width,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 400,
  },
  dotsContainer: {
    height: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2C6F9C",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#2E4F82",
  },
  inactiveDot: {
    backgroundColor: "#D9D9D9",
  },
});

export default Carousel;
