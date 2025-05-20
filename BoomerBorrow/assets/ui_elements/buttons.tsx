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
    <TouchableOpacity style={[button_style[`button_${variant}`], { marginBottom: bottom_margin }]} onPress={on_press}>
      <Text style={button_style.text}>{title}</Text>
    </TouchableOpacity>
  );
};

type Button_two_choice = {
  title: string;
  onPress: () => void;
  selected: boolean;
  variant: "left" | "right";
};

/**
 * An abstract two-choice button comp. for UI
 * 
 * @param {string} title - Button title
 * @param {() => void} on_press - Function to be called when pressed
 * @param {string} variant - Left or right version
 * @param {number} bottom_margin - The margin to the element below, i.e. the "buffer-zone"
* @returns {JSX.Element} the button ellement
 */
export const button_two_choice = ({ title, onPress, selected, variant }: Button_two_choice): JSX.Element => {
  return (
    <TouchableOpacity 
      style={[
        button_tc_style[`sorting_button_${variant}`], 
        selected && button_tc_style.selected
      ]}
      onPress={onPress}
    >
      <Text style={button_tc_style.text}>{title}</Text>
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

const button_style = StyleSheet.create({
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

const button_tc_common: ViewStyle  = {
		flex: 1,
		padding: 16,
		alignItems: 'center',
		backgroundColor: '#9C9C9C',
}

const button_tc_style = StyleSheet.create({
  sorting_button_left: {
    ...button_tc_common,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  sorting_button_right: {
    ...button_tc_common,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  selected: {
    backgroundColor: '#007BFF',
  },
  text: {
    color: '#fff',
    fontWeight: "bold",
    fontSize: 24,
  },
});