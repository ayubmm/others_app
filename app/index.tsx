import React, { useEffect } from "react";
import { Redirect } from "expo-router";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import iconImage from "../assets/images/logosmadajo.png"; // Pastikan path sesuai dengan lokasi ikon di folder

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen() {
  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Expo Push Token:", token);
    };

    requestPermissionAndGetToken();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { title, body } = notification.request.content;
        Alert.alert(
          title ?? "Notifikasi",
          body ?? "Anda memiliki notifikasi baru."
        );
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    // Menampilkan notifikasi lokal dengan ikon kustom
    // const showLocalNotification = async () => {
    //   await Notifications.scheduleNotificationAsync({
    //     content: {
    //       title: "Notifikasi Kustom",
    //       body: "Ini adalah notifikasi dengan ikon kustom!",
    //     },
    //     trigger: null, // Mengirim langsung tanpa penundaan
    //   });
    // };

    // // Panggil fungsi notifikasi lokal sebagai contoh
    // showLocalNotification();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return <Redirect href="/splash" />;
}
