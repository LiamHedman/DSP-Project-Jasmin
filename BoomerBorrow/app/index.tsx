import React from "react";
import { Link } from 'expo-router';
import { Text, View, StyleSheet, ImageBackground } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
//import reactLogo from '/images/react-logo@3x.png'; // ✅ Correct way to load local image

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground 
          //source={reactLogo} 
          resizeMode="cover" 
          style={styles.backgroundImage}
        >
          <View style={styles.container}>
            
            <Text>WELCOME TO BOOMERBORROW</Text>
            <Link href="/(tabs)/(login)"> Login</Link>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});