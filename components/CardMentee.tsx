import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface MenteeRequestCardProps {
  menteeName: string;
  mentorName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  graduation: string;
  question: string;
  requestId: string; // Add request ID to identify the request for approval
  onApprovalSuccess: () => void; // Callback function to refresh data after approval
}

const MenteeRequestCard = ({
  menteeName,
  mentorName,
  status,
  question,
  createdAt,
  updatedAt,
  requestId,
  graduation,
  onApprovalSuccess,
}: MenteeRequestCardProps) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `https://skripsi.krayu.shop/api/mentee/requests/${requestId}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        Alert.alert("Success", response.data.message);
        onApprovalSuccess(); // Call callback to refresh data or update UI
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to approve request");
      console.error("Approval error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.text}>
        <Text style={styles.label}>Nama Mentee : </Text>
        {menteeName}
      </Text>

      <Text style={styles.text}>
        <Text style={styles.label}>Fokus Program : </Text>
        {question}
      </Text>
      <Text style={styles.text}>
        <Text style={styles.label}>Lulusan tahun : </Text>
        {graduation}
      </Text>

      {/* Approve Button */}
      {status !== "approved" ? (
        <TouchableOpacity
          style={styles.approveButton}
          onPress={handleApprove}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.approveButtonText}>Approve</Text>
          )}
        </TouchableOpacity>
      ) : (
        <Text style={styles.approvedText}>Approved</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333",
    marginBottom: 5,
  },
  label: {
    fontFamily: "Poppins_700Bold",
    color: "#2C6F9C",
  },
  approveButton: {
    backgroundColor: "#2C6F9C",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  approveButtonText: {
    color: "#fff",
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
  },
  approvedText: {
    color: "#4CAF50",
    fontFamily: "Poppins_700Bold",
    fontSize: 14,
    marginTop: 10,
  },
});

export default MenteeRequestCard;
