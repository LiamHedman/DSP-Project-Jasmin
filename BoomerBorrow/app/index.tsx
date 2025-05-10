import React from "react";
import { Link } from 'expo-router';
import { Text, View, StyleSheet, Image, ImageBackground } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import logo from './../assets/images/BoomerBorrow_logo.png'; // ✅ Correct way to load local image

export default function Index() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image source={logo} style={styles.image} />
          <Text>WELCOME TO BOOMERBORROW</Text>
          <br />
          <button>
            <Link href="/(tabs)/(login)"> Start</Link>
          </button>
          <ImageBackground
            // source={logo}
            resizeMode="cover"
            style={styles.backgroundImage}
          >
          </ImageBackground>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  backgroundImage: {
    flex: 1,
    color: 'white',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    borderRadius: 5,
  }
});