import * as Notifications from "expo-notifications";

import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import RechargeScreen from "./screens/RechargeScreen";
import AccountScreen from "./screens/AccountScreen";
import SubscriptionDashboard from "./SuscriptionDashboard";
import * as Device from "expo-device";

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Notification token:", token);
  } else {
    alert("Must use physical device for Push Notifications");
  }
  return token;
}

const Stack = createStackNavigator();
export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen
          name="SubscriptionDashboard"
          component={SubscriptionDashboard}
        />
        <Stack.Screen name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="RechargeScreen" component={RechargeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
