import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import MenteeRequestCard from "../CardMentee";

interface MenteeRequest {
  id: string;
  menteeName: string;
  mentorName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  question: string;
  graduation: string;
}

interface MenteeRequestListProps {
  requests: MenteeRequest[];
}

const MenteeRequestList = ({ requests }: MenteeRequestListProps) => (
  <View style={styles.container}>
    <Text style={styles.header}>
      Daftar Permintaan Request Program Mentorship
    </Text>
    <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
      {requests.map((request) => (
        <MenteeRequestCard
          requestId={request.id}
          onApprovalSuccess={() => "succes"}
          question={request.question}
          graduation={request.graduation}
          key={request.id}
          menteeName={request.menteeName}
          mentorName={request.mentorName}
          status={request.status}
          createdAt={request.createdAt}
          updatedAt={request.updatedAt}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingVertical: 10 },
  header: {
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    color: "#2C6F9C",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default MenteeRequestList;
