import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

type Button = {
  title: string;
  on_press: () => void;
  variant: "visit" | "remove";
  bottom_margin: number;
};

/**
 * An abstract button comp. for UI
 * 
 * @param {string} title - Button title
 * @param {() => void} on_press - Function to be called when pressed
 * @param {string} variant - Style of the button, i.e. "visit" or "remove"
 * @param {number} bottom_margin - The margin to the element below, i.e. the "buffer-zone"
* @returns {JSX.Element} the button ellement
 */
export const button = ({ title, on_press, variant, bottom_margin = 0 }: Button): JSX.Element => {
  return (
    <TouchableOpacity style={[styles[`button_${variant}`], { marginBottom: bottom_margin }]} onPress={on_press}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

// boilerplate for the button styles, doesnt have to be used
const button_common: ViewStyle  = {
    width: "80%",
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
}

const styles = StyleSheet.create({
// Add your styles here :)

  button_visit: {
    ...button_common,
    backgroundColor: '#007AFF',
  },
  button_remove: {
      ...button_common,
    backgroundColor: '#000000',
  },

  text: {
    color: '#fff',
    fontSize: 16,
	fontWeight: "bold",
  },
});
