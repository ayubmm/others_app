import React, { useEffect, useState, useCallback } from "react";
import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import Carousel from "@/components/Carrousel";
import NewsCarousel from "@/components/NewsCarousel";
import EventCard from "@/components/EventCard";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function HomeScreen() {
  const { token } = useAuth();
  const [newsData, setNewsData] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  const images = [
    {
      id: "1",
      source: require("@/assets/images/banner1.png"),
    },
    {
      id: "2",
      source: require("@/assets/images/banner2.png"),
    },
    {
      id: "3",
      source: require("@/assets/images/banner3.png"),
    },
  ];

  const fetchNews = async () => {
    try {
      const response = await axios.get(
        "https://skripsi.krayu.shop/api/berita",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewsData(response.data.data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await axios.get(
        "https://skripsi.krayu.shop/api/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEventData(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNews();
      fetchEvent();
      setLoading(false);
    }
  }, [token]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNews();
    await fetchEvent();
    setRefreshing(false);
  }, [token]);

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "white", dark: "#1D3D47" }}
      headerImage={<Carousel images={images} />}
    >
      <SafeAreaView style={styles.safearea}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.headingContainer}>
            <Text style={styles.headingText}>Berita Terbaru</Text>
            <Text style={styles.subheadingText}>dan event terdekat</Text>
            <View style={styles.underline} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Berita Terbaru</Text>
            <NewsCarousel data={newsData} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Event Terdekat</Text>
            <EventCard data={eventData} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    backgroundColor: "white",
    width: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headingContainer: {
    marginBottom: 2,
  },
  headingText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 28,
    color: "#2E4F82",
  },
  subheadingText: {
    fontFamily: "Poppins_700Bold",
    fontSize: 22,
    color: "#2E4F82",
  },
  underline: {
    width: 40,
    height: 4,
    backgroundColor: "#2E4F82",
    marginTop: 4,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "Poppins_700Bold",
    color: "#2E4F82",
    fontSize: 18,
  },
});
