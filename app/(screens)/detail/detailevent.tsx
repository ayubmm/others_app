import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
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
type DetailEventRouteProp = RouteProp<RootStackParamList, "detail/detailevent">;

const DetailEvent: React.FC = () => {
  const route = useRoute<DetailEventRouteProp>();
  const { id } = route.params;
  const { token } = useAuth();
  const navigation = useNavigation();
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // if (!fontsLoaded) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `https://skripsi.krayu.shop/api/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEventData(response.data.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

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

  const handleRegister = async () => {
    Alert.alert(
      "Konfirmasi Kehadiran",
      "Apakah Anda yakin ingin mendaftar untuk acara ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Ya, Daftar",
          onPress: async () => {
            try {
              const response = await axios.post(
                `https://skripsi.krayu.shop/api/events/${id}/register`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.data.status === "success") {
                Alert.alert(
                  "Berhasil!",
                  "Anda berhasil mendaftar untuk acara ini."
                );
              } else if (
                response.data.status === "error" &&
                response.data.message === "Anda sudah terdaftar pada event ini."
              ) {
                Alert.alert(
                  "Pendaftaran Gagal",
                  "Anda sudah terdaftar pada event ini."
                );
              } else {
                Alert.alert(
                  "Gagal",
                  response.data.message || "Pendaftaran gagal."
                );
              }
            } catch (error: any) {
              if (error.response && error.response.status === 400) {
                Alert.alert(
                  "Gagal",
                  error.response.data.message ||
                    "Terjadi kesalahan pada permintaan."
                );
              } else {
                Alert.alert("Gagal", "Terjadi kesalahan saat mendaftar.");
                console.error("Error registering for event:", error);
              }
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E4F82" />
      </View>
    );
  }

  if (!eventData) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Event tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Detail Berita</Text>
      </View>

      <ScrollView style={styles.views}>
        <Text style={styles.title}>{eventData.title}</Text>
        <Image style={styles.image} source={{ uri: `${eventData.images}` }} />
        <Text style={styles.label}>Lokasi</Text>
        <Text style={styles.info}>{eventData.location}</Text>

        <Text style={styles.label}>Waktu</Text>
        <Text style={styles.info}>{formatDate(eventData.date)}</Text>

        <Text style={styles.label}>Deskripsi</Text>
        <Text style={styles.description}>{eventData.description}</Text>
      </ScrollView>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Ikuti Acara</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  views: {
    paddingHorizontal: 20,
  },
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
  registerButton: {
    backgroundColor: "#2E4F82",
    paddingVertical: 15,
    borderRadius: 10, // Rounded corners
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20,
  },
  registerButtonText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  image: {
    width: "100%",
    height: 300,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
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
  },
  label: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#2E4F82",
    marginTop: 20,
    marginBottom: 8,
  },
  info: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#555",
    marginTop: 8,
    lineHeight: 24,
  },
});

export default DetailEvent;
