
import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ColorValue, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { router, Stack, Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useIsFocused, useNavigationState, useNavigation } from "@react-navigation/native";

type TabItem = {
  name: string;
  label: string;
  icon: (color: string, size: number, marginLeft: number) => React.ReactNode;
};

const tabItems: TabItem[] = [
  {
    name: "(marketplace)",
    label: "Marknad",
    icon: (color, size, marginLeft) => <FontAwesome size={size} color={color} style={{marginLeft: marginLeft}}/>,
  },
  {
    name: "(chat)",
    label: "Meddelanden",
    icon: (color, size, marginLeft) => <FontAwesome size={size} color={color} style={{marginLeft: marginLeft}}/>,
  },
  {
    name: "(user_profile)/user_profile_page",
    label: "Min \nProfil",
    icon: (color, size, marginLeft) => <FontAwesome size={size} color={color} style={{marginLeft: marginLeft}}/>,
  },
  {
    name: "(supply_posts)/create_supply_post",
    label: "Ny annons",
    icon: (color, size, marginLeft) => <FontAwesome size={size} color={color} style={{marginLeft: marginLeft}} />,
  },
];

const topRowCount = 2;

export default function TabLayout() {
  return (
      <Tabs
      screenOptions={() => ({
        headerShown: false,
      })}
      tabBar={(props) => <CustomTabBar {...props} />}
      
    />
  );
}

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const half = Math.ceil(tabItems.length / 2);
  const leftTabs = tabItems.slice(0, half);
  const rightTabs = tabItems.slice(half, tabItems.length);

  const renderTabButton = (item: TabItem, index: number) => {
    console.log("hej");
    console.log(item);
    const route = state.routes.find(r => r.name === item.name);
    if (!route) return null;
    console.log("hej");
    const isFocused = state.index === state.routes.findIndex(r => r.name === item.name);

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        style={getButtonStyle(getColor(route.name, isFocused))}
      >
        {item.icon("black", 50, 15)}
        <Text numberOfLines={3} adjustsFontSizeToFit style={getTextStyle()}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={getBackgroundStyle(state.routeNames[state.index])}>
      {/* Left column */}
      <View style={{ flexDirection: "column", flex: 1 }}>
        {leftTabs.map((item, index) => renderTabButton(item, index))}
      </View>

      {/* Right column */}
      <View style={{ flexDirection: "column", flex: 1 }}>
        {rightTabs.map((item, index) => renderTabButton(item, index))}
      </View>
    </View>
  );
};

const getButtonStyle = (color: ColorValue): ViewStyle => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: color,
  justifyContent: "center",

});
const getBackgroundStyle = (routeName: string): ViewStyle => ({
  backgroundColor: "ffffff", 
  height: "15%",
  flexDirection: "row", 
  justifyContent: "center",
  borderTopWidth: 1,
  borderColor: "#0C1013",
});

const getColor= (routeName: string, isFocused: boolean): ColorValue => {
  switch (routeName) {
    case "(supply_posts)":
      return isFocused ? "#007BFF" : "#007BFF";
    case "(login)":
      return isFocused ? "#007BFF" : "#007BFF";
    case "(marketplace)":
      return isFocused ? "#007BFF" : "#007BFF";
    case "(chat)/ChatListScreen":
      return isFocused ? "#007BFF" : "#007BFF";
    default:
      return isFocused ? "#007BFF" : "#007BFF";
  }
}

/*
const getBackgroundColor = (routeName: String): ColorValue => {
  switch (routeName) {
    case "(login)":
      return "#D2F8B8";
    case "(marketplace)":
      return "#D2F8B8";
    case "(chat)/connection":
      return "#FFFB9F";
    case "(supply_posts)/create_supply_post":
      return "#FFFB9F";
    default:
      return "FFFB9F";
}
};
*/

const getTextStyle = (): TextStyle => ({
  color: "#fff",
  flexShrink: 0,
  fontSize: 20,
  fontWeight: "bold",
});

const getHeaderTitle = (routeName: string): string => {
  switch (routeName) {
    case "(marketplace)":
      return "Marketplace";
    case "(user_profile)/user_profile_page":
      return "Profile";
    case "(chat)/connection":
      return "Connection";
    case "(supply_posts)/create_supply_post":
      return "Create Post";
    default:
      return "App";
  }
};