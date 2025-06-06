import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { User } from "./../../../classes_tmp";
import { save_user_id, save_user_name } from "@/auth_token";

export default function LoginScreen() {
	const SERVER_URL = "http://localhost:3000";

	// User info
	let user: User;
	const [role, set_role] = useState("");
	const [name, set_name] = useState("");
	const [mail, set_mail] = useState("");
	const [phone_number, set_phone_number] = useState("");
	const [bio, set_bio] = useState("");
	const [address, set_address] = useState("");
	const [date_of_birth, set_date_of_birth] = useState("");
	const [profile_picture_url, set_profile_picture_url] = useState("");
	const [password, set_password] = useState("");

	// Error texts
	const [error_message, set_error_message] = useState("");
	const [password_error, set_password_error] = useState("");
	const [mail_error, set_mail_error] = useState("");
	const [name_error, set_name_error] = useState("");

	const validate_password = (text: string) => {
		set_password(text);

		if (text.length < 8) {
			set_password_error("Lösenordet måste bestå av minst 8 tecken");
		} else if (!/\d/.test(text)) {
			set_password_error("Lösenordet måste innehålla minst en siffra");
		} else if (!/[A-Z]/.test(text)) {
			set_password_error("Lösenordet måste innehålla minst en stor bokstav");
		} else {
			set_password_error(""); // No error if password is valid
		}
	};

	const validate_mail = (text: string) => {
		set_mail(text);

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Standard email format
		if (!emailRegex.test(text)) {
			set_mail_error("Ogiltig e-postadress. Kontrollera formatet.");
		} else {
			set_mail_error(""); // No error if valid
		}
	}

	const validate_name = (name: string) => {
		set_name(name);

		if (!(name.trim().length >= 2)) {
			set_name_error("Ogiltigt användarnamn. Måste bestå av minst 2 tecken")
		} else {
			set_name_error("");
		}
	}

	function validate_registration(): boolean {
		return password_error.length === 0 &&
			mail_error.length === 0 &&
			name_error.length === 0 &&
			name.length != 0 &&
			password.length != 0 &&
			mail.length != 0;
	}

	async function register_user() {
		try {
			user = new User("standard", role, name, mail, phone_number, bio, address, date_of_birth, profile_picture_url, password);
			await axios.post(`${SERVER_URL}/register_user`, user);
			save_user_id(user.id);
			save_user_name(user.name);
			//router.push("/(tabs)/(marketplace)");
			router.back();
		} catch (error: any) {
			if (error.response) {
				switch (error.response.status) {
					//case 418:
						//set_error_message("Användarnamnet är redan registrerad.")
						//break;
					case 419:
						set_error_message("Mailadressen är redan registrerad.");
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

	const handle_register = async () => {
		if (validate_registration()) {
			await register_user();
		}
	};

	const handle_login = async () => {
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>

			{/* Input fields for user reg. */}
			<Text style={styles.title}>Registrera dig</Text>

			{/* Name Input */}
			<TextInput
				style={styles.input}
				placeholder="Användarnamn"
				placeholderTextColor="#888"
				value={name}
				onChangeText={validate_name}
			/>
			{name_error ? <Text style={styles.errorText}>{name_error}</Text> : null}
			{/* Email Input */}
			<TextInput
				style={styles.input}
				placeholder="E-post"
				placeholderTextColor="#888"
				keyboardType="email-address"
				value={mail}
				onChangeText={validate_mail}
			/>
			{mail_error ? <Text style={styles.errorText}>{mail_error}</Text> : null}

			{/* Password Input */}
			<TextInput
				style={styles.input}
				placeholder="Lösenord"
				placeholderTextColor="#888"
				secureTextEntry
				value={password}
				onChangeText={validate_password}
			/>
			{password_error ? <Text style={styles.errorText}>{password_error}</Text> : null}
			{/* Confirm Password Input */}
			{/* 		  <TextInput
			style={styles.input}
			placeholder="Bekräfta lösenord"
			placeholderTextColor="#888"
			secureTextEntry
			value={confirmPassword}
			onChangeText={setConfirmPassword}
		  /> */}

			{/* Register Button */}
			<TouchableOpacity style={styles.button} onPress={handle_register}>
				<Text style={styles.buttonText}>Registrera kontot</Text>
			</TouchableOpacity>

			{error_message ? <Text style={styles.errorText}>{error_message}</Text> : null}

			{/* Login button */}
			<TouchableOpacity style={styles.button} onPress={handle_login}>
				<Text style={styles.buttonText}>Logga in med befintligt konto</Text>
			</TouchableOpacity>
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
	icon: {
		width: 200,
		height: 200,
		marginBottom: 20,
		position: "absolute",
		top: 80,
		left: "50%",
		transform: [{ translateX: -100 }], // Centers horizontally
	},
	title: {
		fontSize: 36,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 0,
	},
	input: {
		width: "80%",
		height: 65,
		backgroundColor: "#FFF",
		borderWidth: 1,
		borderColor: "#DDD",
		borderRadius: 10,
		paddingHorizontal: 15,
		marginVertical: 10,
		fontSize: 20,
	},
	button: {
		width: "80%",
		backgroundColor: "#007AFF",
		paddingVertical: 16,
		borderRadius: 10,
		alignItems: "center",
		justifyContent: "center",
		marginTop: 15,
	},
	buttonText: {
		color: "#FFF",
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center"
	},
	linkButton: {
		marginTop: 15,
	},
	linkText: {
		color: "#007AFF",
		fontSize: 14,
	},
	errorText: {
		color: "red",
		fontSize: 18,
		marginTop: 5,
		fontStyle: "italic",
	},

});