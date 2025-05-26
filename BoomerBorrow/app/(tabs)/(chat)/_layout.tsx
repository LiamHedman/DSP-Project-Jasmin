import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { useNavigationState, useNavigation } from "@react-navigation/native";
import { title } from "process";

export default function ChatLayout() {
  return (
    <Stack
      initialRouteName="ChatListScreen"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FF8400", 
        },headerTitleStyle: {
          fontSize: 28,
          fontWeight: "bold",
          color: "white",
        },
        headerLeft: () => {
          const navigation = useNavigation();
          const routesLength = useNavigationState(state => state.routes.length);
          const currentRoute = useNavigationState(state => state.routes[state.index]?.name);

          // Don't show back button on (chat)/index
          if (currentRoute === "index" || routesLength <= 1) {
            return null;
          }

          return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="arrow-left" size={30} color="white" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          );
        }
      }}
    >
      <Stack.Screen name="index" options={{title: "Meddelanden"}}/>
      <Stack.Screen name="chat" options={{title: "Gå till meddelanden"}}/>
    </Stack>
  );
}