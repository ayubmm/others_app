import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";

interface Profile {
  name: string;
  email: string;
  address: string;
  graduation: number;
  phone: string;
  role: string;
  followers: number;
  following: number;
  birthDate: string;
  photo: string;
}

export default function ProfileScreen() {
  const { logout, token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `https://skripsi.krayu.shop/api/alumni/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setProfile(data.data); // Assuming profile data is under "data"
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Background and Profile Image */}
      <ImageBackground
        source={require("@/assets/images/bgprofile.png")}
        style={styles.headerBackground}
      >
        <Image
          source={{
            uri:
              profile?.photo ?? "https://example.com/default-profile-photo.jpg",
          }}
          style={styles.profileImage}
        />
      </ImageBackground>

      {/* Profile Information */}
      <View style={styles.profileInfoContainer}>
        <Text style={styles.profileName}>{profile?.name}</Text>

        {/* Location and Followers */}
        <View style={styles.locationAndFollowers}>
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={16} color="#555" />
            <Text style={styles.locationText}>{profile?.address}</Text>
          </View>
        </View>
        <Text style={styles.biodataText}>Lulusan {profile?.graduation}</Text>

        {/* Edit Profile Button */}
        {/* <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profil</Text>
        </TouchableOpacity> */}
      </View>

      {/* Tab Menu */}

      {/* Biodata Section */}
      <View style={styles.biodataContainer}>
        <Text style={styles.biodataTitle}>Data Diri</Text>
        <View style={styles.biodataContent}>
          <Text style={styles.biodataText}>{profile?.email}</Text>
          <Text style={styles.biodataText}>{profile?.birthDate}</Text>
          <Text style={styles.biodataText}>{profile?.phone}</Text>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBackground: {
    width: "100%",
    height: 250,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "white",
  },
  profileInfoContainer: {
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  profileName: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: "#333",
    marginTop: 10,
  },
  locationAndFollowers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 16,
    color: "#555",
    fontFamily: "Poppins_700Bold",
  },
  followInfo: {
    fontSize: 14,
    color: "#777",
    marginHorizontal: 10,
    fontFamily: "Poppins_700Bold",
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#00A0FF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: 10,
  },
  editButtonText: {
    color: "#00A0FF",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  activeTab: {
    color: "#00A0FF",
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: "#00A0FF",
  },
  inactiveTab: {
    color: "#555",
    fontSize: 16,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  biodataContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#F9F9F9",
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  biodataTitle: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#1E305F",
    marginBottom: 10,
  },
  biodataContent: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
  },
  biodataText: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins_700Bold",
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    marginHorizontal: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
