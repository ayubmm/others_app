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
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { FontAwesome } from "@expo/vector-icons";

export interface Profile {
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
  const [modalVisible, setModalVisible] = useState<boolean>(false); // State for modal visibility
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

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
        setProfile(data.data);
        setFormData({
          name: data.data.name,
          address: data.data.address,
          phone: data.data.phone,
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEditProfile = async () => {
    // Example API call to update the profile
    try {
      const response = await fetch(
        `https://skripsi.krayu.shop/api/alumni/profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      Alert.alert("Success", "Profile updated successfully");
      setProfile(data.data);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
    }
  };

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
        <View style={styles.locationAndFollowers}>
          <View style={styles.locationContainer}>
            <FontAwesome name="map-marker" size={16} color="#555" />
            <Text style={styles.locationText}>{profile?.address}</Text>
          </View>
        </View>
        <Text style={styles.biodataText}>Lulusan {profile?.graduation}</Text>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

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

      {/* Modal for Editing Profile */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
              placeholder="Address"
            />
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Phone"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleEditProfile}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    fontFamily: "Poppins_700Bold",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    fontFamily: "Poppins_700Bold",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF6B6B",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Poppins_700Bold",
    color: "white",
    fontSize: 16,
  },
});
