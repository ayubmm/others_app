import { RootStackParamList } from "@/types/navigation";
import { useNavigation } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

const { width } = Dimensions.get("window");

interface EventData {
  id: string;
  images: any;
  title: string;
  location: string;
}

interface EventCardProps {
  data: EventData[];
}
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "detail/detailevent"
>;
const EventCard: React.FC<EventCardProps> = ({ data }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (id: string) => {
    navigation.navigate("detail/detailevent", { id });
  };

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => handlePress(item.id)}
        >
          <Image source={{ uri: `${item.images}` }} style={styles.image} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  card: {
    width: (width - 70) / 2,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    backgroundColor: "#FFF",
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  titleContainer: {
    padding: 12,
    backgroundColor: "#F2F2F2",
    height: 60,
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: "#2E4F82",
  },
  location: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "#2E4F82",
  },
});

export default EventCard;
