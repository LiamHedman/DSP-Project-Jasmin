import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { User } from "./../../classes_tmp";
import { save_user_id } from "@/auth_token";
import { Image } from "react-native";
import { button as Button } from "@/assets/ui_elements/buttons";
import { input_common as Input_common } from "@/assets/ui_elements/text_inputs";

export default function LoginScreen() {
	const SERVER_URL = "http://localhost:3000";

	const [name, set_name] = useState("");
	const [password, set_password] = useState("");
	const [error_message, set_error_message] = useState("");

	async function login() {
		try {
			const user = { name: name, password: password }
			const response = await axios.post(`${SERVER_URL}/login`, user);
			await save_user_id(response.data);

			router.push("/(tabs)/(marketplace)");
		} catch (error: any) {
			if (error.response) {
				switch (error.response.status) {
					case 418:
						set_error_message("Inget konto med detta användarnamn finns registrerat")
						break;
					case 419:
						set_error_message("Fel lösenord för detta användarnamn");
						break;
					case 500:
						set_error_message("Internt serverfel. Försök igen senare.");
						break;
					default:
						set_error_message(`Registrering misslyckades: ${error.response.status}`);
				}
			} else {
				set_error_message("Något gick fel. Kontrollera din anslutning.");
			}
		}
	}

	// Handles a clients login when the login button is pressed
	const handle_login = async () => {
		console.log("Username:", name);
		console.log("Password:", password);
		await login();
	};

	const handle_register = async () => {
		set_error_message("");
		router.push("/(tabs)/(register)");
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Company logo */}
			<Image source={require("./../../assets/images/bb_logo.svg")} style={styles.icon} />

			<Text style={styles.title}>Logga in</Text>

			<View style={styles.input_container}>
				{/* Username input */}
				<Input_common title="Användarnamn" value={name} on_change_text={set_name} />

				{/* Password input */}
				<Input_common title="Lösenord" value={password} on_change_text={set_password} hide_input={true} />
			</View>

			{/* Login button */}
			<Button title="Logga in" on_press={handle_login} variant="visit" bottom_margin={10} />
			{error_message ? <Text style={styles.error_text}>{error_message}</Text> : null}

			{/* Register button */}
			<Button title="Har du inget konto? Registera dig här" on_press={handle_register} variant="visit" bottom_margin={15} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F4F4F4",
	},
	input_container: {
		alignItems: "center",
		width: "100%",
		paddingTop: 20,
		paddingBottom: 20,
	},
	icon: {
		width: 200,
		height: 200,
		marginBottom: 20,
		position: "absolute",
		top: 80,
		left: "50%",
		transform: [{ translateX: -100 }], // needs to be half the width
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 0,
	},
	error_text: {
		color: "red",
		fontSize: 14,
		marginTop: 5,
		fontStyle: "italic",
	},
});