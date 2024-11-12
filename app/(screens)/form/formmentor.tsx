import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext"; // Assuming you have a context for Auth
import * as Notifications from "expo-notifications";
export default function FormPendaftaranMentor() {
  const navigation = useNavigation();
  const { token } = useAuth(); // Get the token from AuthContext
  const [expertise, setExpertise] = useState("");
  const [education, setEducation] = useState("");
  const [currentJob, setCurrentJob] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "none" | "approved" | null>(
    null
  );
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(tokenData.data); // Simpan token Expo
      console.log("Expo Push Token:", tokenData.data); // Untuk memastikan token sudah didapatkan
    };

    registerForPushNotificationsAsync();
  }, []);
  // State for error messages
  const [errors, setErrors] = useState({
    expertise: "",
    education: "",
    currentJob: "",
    portfolio: "",
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  const validateFields = () => {
    let valid = true;
    let newErrors = {
      expertise: "",
      education: "",
      currentJob: "",
      portfolio: "",
    };

    if (!expertise) {
      newErrors.expertise = "Bidang keahlian tidak boleh kosong";
      valid = false;
    }
    if (!education) {
      newErrors.education = "Pendidikan tidak boleh kosong";
      valid = false;
    }
    if (!currentJob) {
      newErrors.currentJob = "Pekerjaan saat ini tidak boleh kosong";
      valid = false;
    }
    if (!portfolio) {
      newErrors.portfolio = "URL portofolio tidak boleh kosong";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Fetch mentor status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          "https://skripsi.krayu.shop/api/mentor/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStatus(response.data.data.application_status); // Assuming response includes a 'status' field
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, []);

  const handleSubmit = async () => {
    if (loading) return;

    if (!validateFields()) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("expertise", expertise);
      formData.append("education", education);
      formData.append("current_job", currentJob);
      formData.append("portfolio", portfolio);
      formData.append("expo_push_token", expoPushToken || "");
      if (photo) {
        formData.append("photo", {
          uri: photo,
          name: "photo.jpg",
          type: "image/jpeg",
        } as any);
      }

      await axios.post(
        "https://skripsi.krayu.shop/api/mentor/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Pendaftaran berhasil! Program mentorship Anda sedang diproses.");
      setStatus("pending"); // Update status to pending after submission
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert("Pendaftaran gagal. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Form Pendaftaran Mentor</Text>
      </View>

      {status === "pending" ? (
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/registrasion.jpg")}
            style={styles.image}
          />
          <Text style={styles.pendingText}>
            Pendaftaran Anda sebagai mentor sedang dalam proses persetujuan.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Daftar sebagai Mentor</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bidang Keahlian</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Pengembangan Perangkat Lunak"
              value={expertise}
              onChangeText={(text) => {
                setExpertise(text);
                setErrors((prev) => ({ ...prev, expertise: "" }));
              }}
              placeholderTextColor="#888"
            />
            {errors.expertise ? (
              <Text style={styles.errorText}>{errors.expertise}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pendidikan</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: S1 Teknik Informatika"
              value={education}
              onChangeText={(text) => {
                setEducation(text);
                setErrors((prev) => ({ ...prev, education: "" }));
              }}
              placeholderTextColor="#888"
            />
            {errors.education ? (
              <Text style={styles.errorText}>{errors.education}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pekerjaan Saat Ini</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Pengembang Perangkat Lunak"
              value={currentJob}
              onChangeText={(text) => {
                setCurrentJob(text);
                setErrors((prev) => ({ ...prev, currentJob: "" }));
              }}
              placeholderTextColor="#888"
            />
            {errors.currentJob ? (
              <Text style={styles.errorText}>{errors.currentJob}</Text>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Portofolio (URL)</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan URL portofolio Anda"
              value={portfolio}
              onChangeText={(text) => {
                setPortfolio(text);
                setErrors((prev) => ({ ...prev, portfolio: "" }));
              }}
              placeholderTextColor="#888"
            />
            {errors.portfolio ? (
              <Text style={styles.errorText}>{errors.portfolio}</Text>
            ) : null}
          </View>

          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>Pilih Foto</Text>
          </TouchableOpacity>
          {photo && (
            <Image source={{ uri: photo }} style={styles.imagePreview} />
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Mengirim..." : "Daftar"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E4F82",
    height: 60,
    paddingHorizontal: 15,
    paddingTop: 15,
    marginTop: 40,
  },
  navbarTitle: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#fff",
    marginLeft: 10,
  },
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#2E4F82",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    color: "#2E4F82",
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  photoButton: {
    backgroundColor: "#2E4F82",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  photoButtonText: {
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
    alignSelf: "center",
  },
  submitButton: {
    backgroundColor: "#03D2B2",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
    fontSize: 16,
  },
  pendingText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 18,
    color: "#2E4F82",
    textAlign: "center",
    marginTop: 20,
  },
});
