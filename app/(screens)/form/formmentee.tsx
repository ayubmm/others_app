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
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { useAuth } from "@/context/AuthContext"; // Assuming you have a context for Auth
import * as Notifications from "expo-notifications";

export default function FormPendaftaranMentee() {
  const navigation = useNavigation();
  const { token } = useAuth(); // Get the token from AuthContext
  const [question, setQuestion] = useState(""); // Update to focus on question field
  const [loading, setLoading] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const [status, setStatus] = useState<"pending" | "none" | "approved" | null>(
    null
  );

  // Error state for question
  const [errors, setErrors] = useState({
    question: "",
  });

  const handleGoBack = () => {
    navigation.goBack();
  };

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
  const validateFields = () => {
    let valid = true;
    let newErrors = { question: "" };

    if (!question) {
      newErrors.question = "Pertanyaan tidak boleh kosong";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(
          "https://skripsi.krayu.shop/api/mentee/status",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStatus(response.data.data.application_status);
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
      const data = { question };
      const formData = new FormData();

      formData.append("question", data.question);
      formData.append("expo_push_token", expoPushToken || "");
      await axios.post(
        "https://skripsi.krayu.shop/api/mentee/register", // Update to the correct endpoint
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Pendaftaran berhasil! Program mentee Anda sedang diproses.");
      setStatus("pending"); // Update status to pending after submission
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        // Fallback message for other errors
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
        <Text style={styles.navbarTitle}>Form Pendaftaran Mentee</Text>
      </View>

      {status === "pending" ? (
        <View style={styles.container}>
          <Image
            source={require("@/assets/images/registrasion.jpg")}
            style={styles.image}
          />
          <Text style={styles.pendingText}>
            Pendaftaran Anda sebagai mentee sedang dalam proses persetujuan.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Daftar sebagai Mentee</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Hal apa yang ingin kamu tanyakan kepada mentor?
            </Text>
            <TextInput
              style={styles.textArea}
              placeholder="Masukkan pertanyaan Anda"
              value={question}
              onChangeText={(text) => {
                setQuestion(text);
                setErrors((prev) => ({ ...prev, question: "" }));
              }}
              placeholderTextColor="#888"
              multiline
              numberOfLines={4} // Adjusts height to look like a textarea
            />
            {errors.question ? (
              <Text style={styles.errorText}>{errors.question}</Text>
            ) : null}
          </View>

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
  textArea: {
    height: 120,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    textAlignVertical: "top", // Aligns text to the top in multiline TextInput
    fontFamily: "Poppins_400Regular",
    color: "#333",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
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
