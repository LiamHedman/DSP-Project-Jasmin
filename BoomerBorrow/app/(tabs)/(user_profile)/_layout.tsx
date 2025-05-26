import { FontAwesome } from "@expo/vector-icons";
import { Stack, useNavigation } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function MarketplaceLayout() {
  return (
    <Stack
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
          return (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <FontAwesome name="arrow-left" size={30} color="white" style={{ marginLeft: 15 }} />
            </TouchableOpacity>
          );
        },
      }}
    >
      <Stack.Screen name="edit_user" options={{title: "Redigera din profil"}}/>
      <Stack.Screen name="index" options={{title: "Din profil"}}/>
    </Stack>
  );
}