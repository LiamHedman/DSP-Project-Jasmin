import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import React from "react";

type CustomTabButtonProps = BottomTabBarButtonProps & {
  icon: React.ReactNode;
  label: string;
  color: string;
};

const CustomTabButton: React.FC<CustomTabButtonProps> = ({icon, label, color, onPress,}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
      }}
    >
      {icon}
      <Text
        style={{
          color: color,
          fontSize: 18,
          fontWeight: "bold",
          maxWidth: 140,
          marginTop: 5,
        }}
      >
      {label}
      </Text>
    </TouchableOpacity>
  );
};

type TabItem = {
  name: string;
  label: string;
  icon: React.ReactNode;
};

const tabItems: TabItem[] = [
  {
    name: "index",
    label: "Home",
    icon: <FontAwesome name="home" size={28} color="gray" />,
  },
  {
    name: "(login)",
    label: "Logga in",
    icon: <FontAwesome name="user-circle" size={28} color="gray" />,
  },
  {
    name: "(marketplace)",
    label: "Lägg till annons",
    icon: <FontAwesome name="calendar" size={28} color="gray" />,
  },
];

export default function TabLayout() {
  return (
    <SafeAreaView style = {{flex:1}}>
      <Tabs screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarStyle: {
            position: "absolute",
            height: 80,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: "black",
            borderTopWidth: 0,
          },
          headerShown: false,
        }} >
          {tabItems.map((item) => (
            <Tabs.Screen
              key={item.name}
              name={item.name}
              options={{
                tabBarButton: (props) => (
                  <CustomTabButton
                    {...props}
                    icon={item.icon}
                    label={item.label}
                    color={props.accessibilityState?.selected ? "white" : "gray"}
                  />
                ),
              }}

              />
            ))}
        </Tabs>
    </SafeAreaView>
  );
  /*
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
    <Tabs
        screenOptions={{
          tabBarActiveTintColor: "white",
          tabBarStyle: {
            position: "absolute",
            height: 80,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            backgroundColor: "black",
            borderTopWidth: 0,
          },
          headerShown: false,
        }}
        >
        
        <Tabs.Screen
        name="index"
        options={{
          tabBarButton: (buttonProps) => (
            <CustomTabButton
            {...buttonProps}
            icon={
              <FontAwesome
              size={28}
              name="home"
              color={
                buttonProps.accessibilityState?.selected ? "white" : "gray"
              }
              />
            }
            label="Home"
            color={
              buttonProps.accessibilityState?.selected ? "white" : "gray"
            }
            />
          ),
        }}
        />
        <Tabs.Screen
        name="marketplace"
        options={{
          tabBarButton: (buttonProps) => (
            <CustomTabButton
            {...buttonProps}
            icon={
              <FontAwesome
              size={28}
              name="calendar"
              color={
                buttonProps.accessibilityState?.selected ? "white" : "gray"
              }
              />
            }
            label="Lägg till annons"
            color={
              buttonProps.accessibilityState?.selected ? "white" : "gray"
            }
            />
          ),
        }}
        />
        <Tabs.Screen
        name="login"
        options={{
          tabBarButton: (buttonProps) => (
            <CustomTabButton
            {...buttonProps}
            icon={
              <FontAwesome
              size={28}
              name="user-circle"
              color={
                buttonProps.accessibilityState?.selected ? "white" : "gray"
              }
              />
            }
            label="Logga in"
            color={buttonProps.accessibilityState?.selected ? "white" : "gray"}
            />
          ),
        }}
        />
        </Tabs>
        </SafeAreaView>
      );
      */
}