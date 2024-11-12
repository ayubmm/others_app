import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "detail/detailjobs"
>;

interface JobData {
  id: string;
  company_logo: string;
  title: string;
  company_name: string;
  location: string;
  created_at: string;
}

interface JobCardListProps {
  data: JobData[];
}

const JobCard: React.FC<JobCardListProps> = ({ data }) => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const navigation = useNavigation<NavigationProp>();

  // Jika font belum dimuat, tampilkan indikator pemuatan
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Fungsi untuk menghitung berapa hari yang lalu
  const getDaysAgo = (dateString: string) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const differenceInTime = now.getTime() - createdAt.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return `${differenceInDays} hari yang lalu`;
  };

  // Fungsi navigasi ke halaman detail
  const handlePress = (id: string) => {
    navigation.navigate("detail/detailjobs", { id });
  };

  return (
    <View style={styles.container}>
      {data.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.cardContainer}
          onPress={() => handlePress(item.id)}
        >
          {/* Header Pekerjaan */}
          <View style={styles.header}>
            <Image source={{ uri: item.company_logo }} style={styles.logo} />
            <View style={styles.headerText}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.company}>{item.company_name}</Text>
              <Text style={styles.daysAgo}>{getDaysAgo(item.created_at)}</Text>
            </View>
          </View>

          {/* Lokasi Pekerjaan */}
          <View style={styles.body}>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 2,
    backgroundColor: "white",
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    margin: 6,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.9,
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#333",
  },
  company: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
    fontFamily: "Poppins_400Regular",
  },
  daysAgo: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Poppins_400Regular",
  },
  body: {
    marginTop: 16,
  },
  location: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    color: "#2C6F9C",
  },
});

export default JobCard;
