
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
    label: "SE ANDRAS\nANONSER ",
    icon: (color, size, marginLeft) => <FontAwesome name="shopping-cart" size={size} color={color} style={{marginLeft: marginLeft}}/>,
  },
  {
    name: "(chat)",
    label: "Meddelanden",
    icon: (color, size, marginLeft) => <FontAwesome name="wifi" size={size} color={color} style={{marginLeft: marginLeft}}/>,
  },
  {
    name: "(user_profile)",
    label: "DIN \nPROFIL",
    icon: (color, size, marginLeft) => <FontAwesome name="user-circle" size={size} color={color} style={{marginLeft: marginLeft}}/>,
  },
  {
    name: "(supply_posts)/create_supply_post",
    label: "LÄGG\nUP\nANONS",
    icon: (color, size, marginLeft) => <FontAwesome name="plus-square" size={size} color={color} style={{marginLeft: marginLeft}} />,
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
  const rightTabs = tabItems.slice(half);

  const renderTabButton = (item: TabItem, index: number) => {
    console.log(item);
    const route = state.routes.find(r => r.name === item.name);
    if (!route) return null;

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
        {rightTabs.map((item, index) => renderTabButton(item, index + half))}
      </View>
    </View>
  );
};

const getButtonStyle = (color: ColorValue): ViewStyle => ({
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingVertical: 15,
  backgroundColor: color,
  margin: 8,
  borderRadius: 55,
  shadowColor: "black",
  shadowRadius: 5
});
const getBackgroundStyle = (routeName: string): ViewStyle => ({
  backgroundColor: getColor(routeName, false), 
  height: "25%",
  flexDirection: "row", 
  justifyContent: "center", 
  borderTopLeftRadius: 25,  
  borderTopRightRadius: 25,
  shadowColor: "black", 
  shadowRadius: 15 
});

const getColor= (routeName: string, isFocused: boolean): ColorValue => {
  switch (routeName) {
    case "(supply_posts)":
      return isFocused ? "#DDDA6F" : "#FFFB9F";
    case "(login)":
      return isFocused ? "#DDDA6F" : "#FFFB9F";
    case "(marketplace)":
      return isFocused ? "#91B788" : "#B8E4AE";
    case "(chat)/ChatListScreen":
      return isFocused ? "#91B788" : "#B8E4AE";
    default:
      return isFocused ? "#DDDA6F" : "#FFFB9F";
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
  color: "black",
  flexShrink: 0,
  marginLeft: 8,
  marginRight: 40,
  fontSize: 20,
  fontWeight: "bold",
});

const getHeaderTitle = (routeName: string): string => {
  switch (routeName) {
    case "(marketplace)":
      return "Marketplace";
    case "(login)":
      return "Profile";
    case "(chat)/connection":
      return "Connection";
    case "(supply_posts)/create_supply_post":
      return "Create Post";
    default:
      return "App";
  }
};