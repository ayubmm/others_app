import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { LinearGradient } from "expo-linear-gradient";
import CardList from "@/components/CardMentorship";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "expo-router";
import axios from "axios";
import MentorshipInfo from "@/components/mentorship/mentorshipinfo";
import MenteeRequestList from "@/components/mentorship/menteerequestlist";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { RootStackParamList } from "@/types/navigation";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "registrasi/registrasimentorship"
>;

interface Mentor {
  id: string;
  user_id: string;
  name: string;
  angkatan: string;
  photo: string | null;
  portfolio: string;
  current_job: string;
  education: string;
  status: string;
  expertise: string;
  created_at: string;
  updated_at: string;
}
interface CardData {
  id: string;
  image: { uri: string };
  name: string;
  description: string;
  buttons: string[];
}
interface MentorRequest {
  id: string;
  status: string;
  mentorName: string;
}
interface MenteeRequest {
  id: string;
  menteeName: string;
  question: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function TabTwoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, role: initialRole, setRole } = useAuth();
  const [role, setLocalRole] = useState(initialRole);
  const [mentorData, setMentorData] = useState<CardData[]>([]);
  const [filteredMentorData, setFilteredMentorData] = useState<CardData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });
  const [loadingMentors, setLoadingMentors] = useState(true);
  const [mentorRequests, setMentorRequests] = useState<MentorRequest[]>([]);
  const [menteeRequests, setMenteeRequests] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await axios.get(
          "https://skripsi.krayu.shop/api/check-role",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userRole = response.data.role;
        setLocalRole(userRole);
        setRole(userRole);
      } catch (error) {}
    };

    checkRole();
  }, [token, setRole]);
  const fetchMentorRequests = async () => {
    try {
      const response = await axios.get(
        "https://skripsi.krayu.shop/api/mentee-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const requests: MentorRequest[] = response.data.data.map((req: any) => ({
        id: req.id,
        status: req.status,
        mentorName: req.mentor_name || "Tidak Diketahui",
      }));
      console.log("mentor", requests);
      setMentorRequests(requests);
      // setHasPendingRequests(requests.length > 0);
    } catch (error) {}
  };

  const fetchMentors = async () => {
    if (role === "mentee") {
      setLoadingMentors(true);
      try {
        const response = await axios.get(
          "https://skripsi.krayu.shop/api/mentors",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mentors: CardData[] = response.data.data.map(
          (mentor: Mentor) => ({
            id: mentor.id.toString(),
            image: { uri: mentor.photo },
            name: mentor.name,
            description: mentor.expertise,
            buttons: [mentor.current_job, mentor.education, mentor.expertise],
          })
        );

        setMentorData(mentors);
        setFilteredMentorData(mentors);
      } catch (error) {
      } finally {
        setLoadingMentors(false);
      }
    }
  };

  const fetchMenteeRequests = async () => {
    try {
      const response = await axios.get(
        "https://skripsi.krayu.shop/api/mentee/listrequests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("response", response);
      const requests: MenteeRequest[] = response.data.data.map((req: any) => ({
        id: req.id,
        menteeName: req.mentee_name,
        question: req.question,
        graduation: req.graduation,
        mentorName: req.mentor_name,
        status: req.status,
        createdAt: req.created_at,
        updatedAt: req.updated_at,
      }));

      setMenteeRequests(requests);
    } catch (error) {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchMentors(),
      fetchMenteeRequests(),
      fetchMentorRequests(),
    ]); // Re-fetch all data when refreshing
    setRefreshing(false);
  };

  useEffect(() => {
    console.log("Current role:", role);

    fetchMentors();
    fetchMentorRequests(), fetchMenteeRequests();
  }, [token, role]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        role === "mentee" && styles.menteeBackground,
        role === "mentor" && styles.menteeBackground,
      ]}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={styles.container}>
          <LinearGradient
            colors={["#03D2B2", "#2E4F82", "#22304A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.backgroundText}
          >
            <Text style={styles.textHeader}>Halo Nabil</Text>
          </LinearGradient>
        </View>

        {role === "alumni" ? (
          <MentorshipInfo
            onJoin={() =>
              navigation.navigate("registrasi/registrasimentorship")
            }
          />
        ) : (
          <>
            <View>
              <Text style={styles.textRegistrasi}>
                Kamu sudah terdaftar menjadi {role}
              </Text>
            </View>
            {role === "mentor" && (
              <MenteeRequestList requests={menteeRequests} />
            )}
            {role === "mentee" && mentorRequests.length > 0 && (
              <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
                <View style={styles.requestContainer}>
                  <View style={styles.headerContainer}>
                    <Text style={styles.statusText}>
                      Status Pengajuan Mentoring
                    </Text>
                  </View>
                  <View style={styles.mentoringList}>
                    {mentorRequests.map((request) => (
                      <View key={request.id} style={styles.requestCard}>
                        <Text style={styles.mentorName}>
                          Mentor: {request.mentorName}
                        </Text>
                        <Text style={styles.requestStatus}>
                          Status: {request.status}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {role === "mentee" && (
              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Cari nama, topik, dan kata kunci"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <Text style={styles.rekomendasiText}>
                  Rekomendasi Pencarian
                </Text>
              </View>
            )}
            {role === "mentee" && !loadingMentors && (
              <CardList data={filteredMentorData} />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  requestContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  rekomendasiText: {
    fontFamily: "Poppins_700Bold",
    textAlign: "left",
    paddingHorizontal: 10,
  },
  input: {
    fontFamily: "Poppins_700Bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "#D9D9D9",
    width: "100%",
  },
  formContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  mentoringList: {
    marginTop: 10,
  },
  statusText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 16,
    color: "#2C6F9C",
    marginLeft: 10,
  },
  requestCard: {
    padding: 15,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  mentorName: {
    fontFamily: "Poppins_700Bold",
    color: "#333",
    fontSize: 14,
  },
  requestStatus: {
    fontFamily: "Poppins_400Regular",
    color: "#666",
    fontSize: 13,
    marginTop: 4,
  },
  textRegistrasi: {
    fontFamily: "Poppins_700Bold",
    color: "white",
    backgroundColor: "#2C6F9C",
    textAlign: "left",
    paddingLeft: 20,
    paddingVertical: 5,
  },
  headerContainer: {
    padding: 20,
    borderRadius: 10,
    borderColor: "#D9D9D9",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  safeArea: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#2E4F82",
  },
  container: {
    padding: 20,
  },
  backgroundText: {
    padding: 4,
    borderRadius: 50,
    width: 100,
  },
  textHeader: {
    fontFamily: "Poppins_700Bold",
    color: "white",
    textAlign: "center",
    padding: 4,
  },
  menteeBackground: {
    backgroundColor: "white",
  },
});
