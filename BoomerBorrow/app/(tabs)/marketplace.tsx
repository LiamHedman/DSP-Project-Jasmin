import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function MarketplaceScreen(){
    return (<View style={styles.container}>
          <Text>ANNONSSIDA</Text>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      height: 40,
      width: '80%',
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
    },
  });