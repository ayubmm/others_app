import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext"; // Adjust this import path
import { RootStackParamList } from "@/types/navigation"; // Adjust this import path
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

type DetailBeritaRouteProp = RouteProp<
  RootStackParamList,
  "detail/detailberita"
>;

const DetailBerita: React.FC = () => {
  const route = useRoute<DetailBeritaRouteProp>();
  const { token } = useAuth();
  const navigation = useNavigation();
  const [newsData, setNewsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { slug } = route.params;

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Load news data by slug
  useEffect(() => {
    const fetchNewsDetails = async () => {
      try {
        const response = await axios.get(
          `https://skripsi.krayu.shop/api/berita/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNewsData(response.data.data);
      } catch (error) {
        Alert.alert("Error", "Failed to load news details.");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetails();
  }, [slug]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E4F82" />
      </View>
    );
  }

  if (!newsData) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Berita tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navbar-style Back Button */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Detail Berita</Text>
      </View>

      <ScrollView>
        <Text style={styles.title}>{newsData.title}</Text>
        <Image
          style={styles.image}
          source={{ uri: `https://skripsi.krayu.shop/${newsData.images}` }}
        />
        <Text style={styles.label}>Dibuat pada</Text>
        <Text style={styles.info}>{formatDate(newsData.created_at)}</Text>

        <Text style={styles.label}>Konten</Text>
        <Text style={styles.description}>{newsData.content}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E4F82",
    height: 60,
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  navbarTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: "#2E4F82",
    textAlign: "center",
    marginVertical: 25,
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#2E4F82",
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  info: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});

export default DetailBerita;
