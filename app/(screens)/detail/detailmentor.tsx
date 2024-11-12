import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Linking,
  Alert,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";

interface MentorDetail {
  id: string;
  user_id: string;
  photo: string | null;
  portfolio: string;
  current_job: string;
  education: string;
  status: string;
  phone_number: string;
  expertise: string;
  nama: string;
  angkatan: string;
  created_at: string;
  updated_at: string;
}
type DetailMentorRouteProp = RouteProp<
  RootStackParamList,
  "detail/detailmentor"
>;

export default function MentorDetailScreen() {
  const [mentor, setMentor] = useState<MentorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useAuth();
  const route = useRoute<DetailMentorRouteProp>();
  const mentorId = route.params?.id;
  const navigation = useNavigation();
  const [requestStatus, setRequestStatus] = useState(null);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const handlePortfolioPress = () => {
    if (mentor?.portfolio) {
      Linking.openURL(mentor.portfolio).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  const handleContactMentor = () => {
    if (mentor?.phone_number) {
      const contactUrl = `https://wa.me/${mentor.phone_number}`; // Menggunakan nomor telepon untuk WhatsApp
      Linking.openURL(contactUrl).catch((err) =>
        console.error("Failed to open contact URL:", err)
      );
    } else {
      Alert.alert("Nomor telepon tidak tersedia");
    }
  };

  const checkRequestStatus = async () => {
    try {
      const response = await axios.get(
        `https://skripsi.krayu.shop/api/mentor/check-request-status/${mentorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequestStatus(response.data.data.request_status);
    } catch (error) {
      console.error("Error checking request status:", error);
    }
  };

  const fetchMentorDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://skripsi.krayu.shop/api/mentors/${mentorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMentor(response.data.data);
    } catch (error) {
      console.error("Error fetching mentor details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentorDetail();
    checkRequestStatus();
  }, [mentorId]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleApplyProgram = async () => {
    try {
      const response = await axios.post(
        "https://skripsi.krayu.shop/api/mentee/requests",
        { mentor_id: mentorId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("Berhasil", "Permintaan mentor berhasil diajukan.");
      checkRequestStatus(); // Refresh status setelah permintaan diajukan
    } catch (error: any) {
      Alert.alert(error.response.data.message);
    }
  };

  // Fungsi untuk refresh halaman
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMentorDetail();
    await checkRequestStatus();
    setRefreshing(false);
  }, [mentorId]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Detail Mentor</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 10, height: "100%" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <Text style={styles.headerText}>Detail Mentor</Text>

          <View style={styles.cardContainer}>
            {mentor?.photo && (
              <Image
                source={{ uri: mentor.photo }}
                style={styles.profileImage}
              />
            )}
            <Text style={styles.name}>{mentor?.nama}</Text>
            <Text style={styles.angkatan}>Angkatan: {mentor?.angkatan}</Text>
            <Text style={styles.description}>{mentor?.current_job}</Text>

            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Informasi Lainnya</Text>
              <Text style={styles.detailText}>
                Pekerjaan: {mentor?.current_job}
              </Text>
              <Text style={styles.detailText}>
                Pendidikan: {mentor?.education}
              </Text>
              <Text style={styles.detailText}>
                Pengalaman: {mentor?.expertise}
              </Text>

              {mentor?.portfolio && (
                <TouchableOpacity onPress={handlePortfolioPress}>
                  <Text style={styles.portfolioLink}>
                    Portofolio: {mentor.portfolio}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Tombol Ajukan Program atau Hubungi Mentor */}
          {requestStatus === "approved" ? (
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleContactMentor}
            >
              <Text style={styles.applyButtonText}>Hubungi Mentor</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyProgram}
            >
              <Text style={styles.applyButtonText}>Ajukan Program</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  portfolioLink: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#007BFF",
    marginVertical: 2,
    textDecorationLine: "underline",
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
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
  },
  headerText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 24,
    color: "#2E4F82",
    textAlign: "center",
    marginBottom: 20,
  },
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#333",
  },
  angkatan: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  detailSection: {
    width: "100%",
    marginTop: 12,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#2E4F82",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    marginVertical: 2,
  },
  applyButton: {
    backgroundColor: "#2E4F82",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
  },
});
