import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';

const [number, onChangeNumber] = React.useState('');

export default function LoginScreen() {
  return (
      <View>
        <Text>Some more text</Text>

        <TextInput
        style={styles.input}
        placeholder="Username"
        />

        <TextInput
        style={styles.input}
        placeholder='Password'
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
