import React, { useEffect, useState, useCallback } from "react";
import {
  Image,
  StyleSheet,
  View,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import JobCard from "@/components/JobCard";

export default function WorkScreen() {
  const { token } = useAuth();
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch job data from API
  const fetchJobData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://skripsi.krayu.shop/api/lowongan/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setJobData(response.data.data);
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial fetch on component mount
  useEffect(() => {
    fetchJobData();
  }, [fetchJobData]);

  // Refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJobData();
    setRefreshing(false);
  }, [fetchJobData]);

  // Show loading indicator only on initial load
  if (loading && jobData.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Image
        source={require("@/assets/images/headerjob2.png")}
        style={styles.reactLogo}
      />
      <JobCard data={jobData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#2C6F9C",
  },
  container: {
    backgroundColor: "#FFFFFF",
  },
  reactLogo: {
    height: 200,
    width: "100%",
    resizeMode: "cover",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
