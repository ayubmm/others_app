import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface MentorshipInfoProps {
  onJoin: () => void;
}

const MentorshipInfo = ({ onJoin }: MentorshipInfoProps) => (
  <View style={styles.container}>
    <Image
      source={require("@/assets/images/fotomentor.jpg")}
      style={styles.image}
    />
    <Text style={styles.text}>
      Apakah Anda ingin mengikuti program mentorship?
    </Text>
    <TouchableOpacity onPress={onJoin} style={styles.button}>
      <Text style={styles.buttonText}>Ikuti Program</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  image: { width: "100%", height: "50%" },
  text: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#2E4F82",
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2E4F82",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: "Poppins_700Bold",
    color: "white",
    fontSize: 16,
  },
});

export default MentorshipInfo;
