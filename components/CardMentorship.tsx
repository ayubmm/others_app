import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
const { width } = Dimensions.get("window");

interface CardData {
  id: string;
  image: any;
  name: string;
  description: string;
  buttons: string[]; // Add an array for the button labels
}

interface CardListProps {
  data: CardData[];
}
type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "detail/detailmentor"
>;
const CardList: React.FC<CardListProps> = ({ data }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const navigation = useNavigation<NavigationProp>();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {data.map((item) => (
        <View key={item.id} style={styles.cardContainer}>
          {/* Header with Image and Name */}
          <View style={styles.header}>
            <Image source={item.image} style={styles.profileImage} />
            <View style={styles.headerText}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.buttons.map((buttonLabel, index) => (
                <TouchableOpacity key={index} style={styles.button}>
                  <Text style={styles.buttonText}>{buttonLabel}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("detail/detailmentor", { id: item.id })
            }
            style={styles.detailButton}
          >
            <Text style={styles.detailButtonText}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9, // 90% of screen width
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    fontFamily: "Poppins_400Regular",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    backgroundColor: "#00C6AE",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  detailButton: {
    marginTop: 16,
    backgroundColor: "#00468B",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
  },
  detailButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
});

export default CardList;
