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
  Linking,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { RootStackParamList } from "@/types/navigation";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

type DetailJobsRouteProp = RouteProp<RootStackParamList, "detail/detailjobs">;

const DetailJobs: React.FC = () => {
  const route = useRoute<DetailJobsRouteProp>();
  const { id } = route.params;
  const { token } = useAuth();
  const navigation = useNavigation();
  const [jobData, setJobData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `https://skripsi.krayu.shop/api/lowongan/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJobData(response.data.data);
      } catch (error) {
        console.error("Error fetching job details:", error);
        Alert.alert("Error", "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleApply = () => {
    if (jobData?.url) {
      Linking.openURL(jobData.url).catch(() => {
        Alert.alert("Error", "Failed to open the application link.");
      });
    } else {
      Alert.alert("Error", "Application URL is not available.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E4F82" />
      </View>
    );
  }

  if (!jobData) {
    return (
      <View style={styles.container}>
        <Text style={styles.info}>Pekerjaan tidak ditemukan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Navbar-style Back Button */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Detail Pekerjaan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{jobData.title}</Text>
        <Image style={styles.logo} source={{ uri: jobData.company_logo }} />

        <View style={styles.section}>
          <Text style={styles.label}>Perusahaan</Text>
          <Text style={styles.info}>{jobData.company_name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Deskripsi Perusahaan</Text>
          <Text style={styles.info}>{jobData.company_description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Gaji</Text>
          <Text style={styles.info}>Rp {jobData.salary.toLocaleString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Lokasi</Text>
          <Text style={styles.info}>{jobData.location}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Pendidikan</Text>
          <Text style={styles.info}>{jobData.education}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tipe Pekerjaan</Text>
          <Text style={styles.info}>{jobData.type}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tanggal Posting</Text>
          <Text style={styles.info}>
            {new Intl.DateTimeFormat("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }).format(new Date(jobData.created_at))}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Persyaratan</Text>
          <Text style={styles.info}>{jobData.requirement}</Text>
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Lamar Pekerjaan</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E4F82",
    height: 60,
    paddingHorizontal: 15,
    marginTop: 40,
    paddingTop: 15,
  },
  navbarTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  contentContainer: {
    padding: 20,
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
    marginVertical: 15,
  },
  logo: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#2E4F82",
    marginBottom: 5,
  },
  info: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#555",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  applyButton: {
    backgroundColor: "#2E4F82",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#fff",
  },
});

export default DetailJobs;
