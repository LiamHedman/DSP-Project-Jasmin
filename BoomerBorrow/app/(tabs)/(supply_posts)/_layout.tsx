import { FontAwesome } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function l() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#FFFB9F", // light yellow
        },headerTitleStyle: {
          fontSize: 28,
          fontWeight: "bold",
        },
        headerLeft: () => {
          const navigation = useNavigation();
          return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="arrow-left" size={24} color="black" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen name="index" options={{title: "Skapar annons"}}/>
      <Stack.Screen name="camera" options={{title: "Gå tillbaka"}}/>
      <Stack.Screen name="post_page" options={{title: "Annonssida"}}/>
    </Stack>
  );
}