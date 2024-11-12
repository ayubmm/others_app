import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "form/formmentor"
>;

const RegistrasiMentorship: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  // Function to handle role selection and navigate to the appropriate form
  const handleSelectRole = (role: "mentor" | "mentee") => {
    if (role === "mentor") {
      navigation.navigate("form/formmentor"); // Navigate to mentor registration
    } else if (role === "mentee") {
      navigation.navigate("form/formmentee"); // Navigate to mentor registration
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Registrasi Mentorship</Text>
      </View>
      <Text style={styles.title}>Pilih Peran Anda</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelectRole("mentor")}
        >
          <Image
            source={require("@/assets/images/mentor.jpg")}
            style={styles.image}
          />
          <Text style={styles.optionText}>Ingin Menjadi Mentor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => handleSelectRole("mentee")}
        >
          <Image
            source={require("@/assets/images/mentee.jpg")}
            style={styles.image}
          />
          <Text style={styles.optionText}>Ingin Menjadi Mentee</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
  },
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
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#2E4F82",
    marginVertical: 20,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 10,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#2E4F82",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },
});

export default RegistrasiMentorship;
