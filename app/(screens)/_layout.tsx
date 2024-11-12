import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "@/context/AuthContext"; // Ensure this path is correct

const RootLayout: React.FC = () => {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="detail/detailevent"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="detail/detailberita"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="detail/detailmentor"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="detail/detailjobs"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="form/formmentor" options={{ headerShown: false }} />
        <Stack.Screen name="form/formmentee" options={{ headerShown: false }} />

        <Stack.Screen
          name="registrasi/registrasimentorship"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(login)/index" options={{ headerShown: false }} />
        <Stack.Screen name="splash" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;
