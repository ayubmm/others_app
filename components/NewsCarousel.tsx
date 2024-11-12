import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "expo-router";
import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

const { width } = Dimensions.get("window");

interface NewsData {
  id: number; // The ID is a number
  images: string; // The image is a string (URL)
  title: string; // The title is a string
  uploaded_by: string; // Add other fields as needed
  content: string; // You can include 'content' or any other fields if needed
  slug: string;
}

interface NewsCarouselProps {
  data: NewsData[];
}
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "detail/detailevent"
>;
const NewsCarousel: React.FC<NewsCarouselProps> = ({ data }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (slug: string) => {
    navigation.navigate("detail/detailberita", { slug });
  };
  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePress(item.slug)}
          >
            <Image
              source={{ uri: `${item.images}` }}
              style={styles.cardImage}
            />
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    paddingVertical: 16,
  },
  card: {
    width: width * 0.6, // 60% of the screen width
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#FFF", // Optional: background color for the card
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardTitleContainer: {
    padding: 12,
    backgroundColor: "#F2F2F2",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    height: 140,
  },
  cardTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#2E4F82",
  },
});

export default NewsCarousel;
