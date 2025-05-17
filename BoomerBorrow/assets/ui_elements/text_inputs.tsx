import React from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";

type Input = {
    title: string;
    value: string;
    on_change_text: (text: string) => void;
    hide_input?: boolean;
};

/**
 * An abstract input field
 * 
 * @param {string} title - Title inside the input
 * @param {string} value - value to store the users input
 * @param {(text: string) => void} onChangeText - Function to be called when user types
* @param {boolean} [hide_input] - To hide the input or not (e.g. passwords)
* @returns {JSX.Element} The input element
 */
export const input_common = ({ title, value, on_change_text, hide_input = false }: Input): JSX.Element => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={title}
                placeholderTextColor="#888"
                value={value}
                onChangeText={on_change_text}
                secureTextEntry={hide_input} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "80%",
        alignItems: 'center',
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#DDD",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
    },
});
