import { Tabs } from "expo-router";
import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#2E4F82" : "#8e8e93",
                fontSize: 14,
                fontFamily: focused ? "Poppins_700Bold" : "Poppins_400Regular",
              }}
            >
              Beranda
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Octicons
              name="home"
              size={24}
              color={focused ? "#2E4F82" : "#8e8e93"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mentor"
        options={{
          title: "Mentor",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#2E4F82" : "#8e8e93", //
                fontSize: 14,
                fontFamily: focused ? "Poppins_700Bold" : "Poppins_400Regular",
              }}
            >
              Mentor
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome5
              name="users"
              size={24}
              color={focused ? "#2E4F82" : "#8e8e93"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="work"
        options={{
          title: "Pekerjaan",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#2E4F82" : "#8e8e93", //
                fontSize: 14,
                fontFamily: focused ? "Poppins_700Bold" : "Poppins_400Regular",
              }}
            >
              Pekerjaan
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name="work"
              size={24}
              color={focused ? "#2E4F82" : "#8e8e93"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profil",
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#2E4F82" : "#8e8e93", //
                fontSize: 14,
                fontFamily: focused ? "Poppins_700Bold" : "Poppins_400Regular",
              }}
            >
              Saya
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome
              name="user"
              size={24}
              color={focused ? "#2E4F82" : "#8e8e93"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
