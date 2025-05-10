import React, { useLayoutEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, ColorValue, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Stack, Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useIsFocused } from "@react-navigation/native";

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
    name: "connection",
    label: "Connection",
    icon: (color, size, marginLeft) => <FontAwesome name="wifi" size={size} color={color} style={{marginLeft: marginLeft}}/>,
  },
  {
    name: "(login)",
    label: "DIN \nPROFIL",
    icon: (color, size, marginLeft) => <FontAwesome name="user-circle" size={size} color={color} style={{marginLeft: marginLeft}}/>,
  },
  {
    name: "create_posts",
    label: "LÄGG\nUP\nANONS",
    icon: (color, size, marginLeft) => <FontAwesome name="plus-square" size={size} color={color} style={{marginLeft: marginLeft}} />,
  },
];

const topRowCount = 2;

export default function TabLayout() {
  return (
      <Tabs
      screenOptions={({ navigation, route }) => ({
        headerStyle: {
          backgroundColor: getBackgroundColor(route.name),
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          color: "black"
        },
        headerTitle: getHeaderTitle(route.name),
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="black" style={{ marginLeft: 15 }} />
          </TouchableOpacity>
        )
      })}
      tabBar={(props) => <CustomTabBar {...props} />}
    />
  );
}

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const renderTabButton = (route: any, onPress: () => void, color: ColorValue) => {
    const item = tabItems.find((t) => t.name === route.name);
    if (!item) return null;

    return (
      <TouchableOpacity
        key={route.key}
        onPress={onPress}
        style={getButtonStyle(color)}
      >
        {item.icon("black", 50, 15)} 
        <Text
          numberOfLines={3}
          adjustsFontSizeToFit
          style={getTextStyle()}
        >
          {item.label}
       </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={getBackgroundStyle(state.routeNames[state.index])}>
      {/* Left column */}
      <View style={{ flexDirection: "column", flex: 1 }}>
        {state.routes.slice(0, topRowCount).map((route, index) => {
          const isFocused = state.index === index;
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
          return renderTabButton(route, onPress, isFocused ? "#91B788" : "#B8E4AE");
        })}
      </View>

      {/* Right column */}
      <View style={{ flexDirection: "column", flex: 1 }}>
        {state.routes.slice(topRowCount).map((route, index) => {
          const isFocused = state.index === index + topRowCount;
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
          return renderTabButton(route, onPress, isFocused ? "#DDDA6F" : "#FFFB9F");
        })}
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
const getBackgroundStyle = (routeName: String): ViewStyle => ({
  backgroundColor: getBackgroundColor(routeName), 
  flexDirection: "row", 
  justifyContent: "center", 
  borderTopLeftRadius: 25,  
  borderTopRightRadius: 25,
  shadowColor: "black", 
  shadowRadius: 15 
});

const getBackgroundColor = (routeName: String): ColorValue => {
  switch (routeName) {
    case "(login)":
      return "#D2F8B8";
    case "(marketplace)":
      return "#D2F8B8";
    case "connection":
      return "#FFFB9F";
    case "create_posts":
      return "#FFFB9F";
    default:
      return "red";
}
};

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
    case "connection":
      return "Connection";
    case "create_posts":
      return "Create Post";
    default:
      return "App";
  }
};
