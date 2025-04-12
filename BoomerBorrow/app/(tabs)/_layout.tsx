import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          height: 70,
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: "black",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="event-note" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="presence"
        options={{
          title: "Presensi",
          tabBarIcon: ({ color }) => (
            <>
              <View
                style={{
                  borderWidth: 2, // Lebar border
                  borderColor: "white", // Warna border
                  borderRadius: 50, // Membuat border menjadi bulat
                  width: 60,
                  height: 60,
                  justifyContent: "center", // Memusatkan secara horizontal
                  alignItems: "center", // Memusatkan secara vertikal
                  marginBottom: 20,
                  backgroundColor: "black",
                }}
              >
                <FontAwesome size={28} name="map-marker" color="#FF204E" />
              </View>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="schedule" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="user-circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}