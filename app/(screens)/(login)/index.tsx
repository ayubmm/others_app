import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, loading } = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push("/(tabs)");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          style={styles.headerImage}
          source={require("@/assets/images/headerlogin.png")}
        />
        <Image
          style={styles.loginImage}
          source={require("@/assets/images/gambarlogin.png")}
        />
        <View style={styles.inputForm}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.buttonLoginWrapper}
          disabled={loading}
        >
          <LinearGradient
            colors={["#03D2B2", "#2E4F82", "#22304A"]} // Gradient colors
            start={{ x: 0, y: 0 }} // Start from the top left
            end={{ x: 1, y: 0 }} // End at the top right
            style={styles.buttonLogin}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
    marginTop: 40,
    fontFamily: "Poppins_700Bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerImage: {
    width: "100%",
    height: "30%",
    paddingTop: 10,
    position: "absolute",
    right: 0,
    top: 0,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  loginImage: { width: 300, height: 200 },
  input: {
    fontFamily: "Poppins_700Bold",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderColor: "black",
    backgroundColor: "white",
  },
  inputForm: {
    marginTop: 60,
    width: "80%",
  },
  buttonLoginWrapper: {
    width: "60%",
    marginTop: 40,
  },
  buttonLogin: {
    padding: 10,
    borderRadius: 50,
    alignItems: "center", // Center text
    height: 50,
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins_700Bold",
    color: "#FFFFFF",
    fontSize: 18,
  },
});
