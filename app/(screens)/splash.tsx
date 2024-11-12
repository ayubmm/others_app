import { View, Image, useWindowDimensions } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext"; // Pastikan path ini benar

export default function SplashScreen() {
  const router = useRouter();
  const { token, loading } = useAuth(); // Ambil token dan loading dari context
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (!loading) {
      if (token) {
        router.push("/(tabs)");
      } else {
        router.push("/(login)");
      }
    }
  }, [loading, token]);

  return (
    <View>
      <Image
        source={require("@/assets/images/splashscreen.png")}
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
}
