import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { User } from "./../../classes_tmp";
import { save_user_id } from "@/auth_token";
import { Image } from "react-native";

export default function LoginScreen() {
	const SERVER_URL = "http://localhost:3000";

	let user: User;
	
	const [role, set_role] = useState("");
	const [name, set_name] = useState("");
	const [mail, set_mail] = useState("temp@temp.dk");
	const [phone_number, set_phone_number] = useState("12345678");
	const [bio, set_bio] = useState("hej jag gillar att klippa gräs");
	const [address, set_address] = useState("Östra Vägen, 42, Gävkle");
	const [date_of_birth, set_date_of_birth] = useState("1905-02-01");
	const [profile_picture_url, set_profile_picture_url] = useState("ger23423wsdf");
	const [password, set_password] = useState("");
	const [created_at, set_created_at] = useState("19950201");

	const [error_message, set_error_message] = useState("");
	
	const [users, set_users] = useState<User[]>([]);

	// If you need to execute something on page mount (when you load the page)
	useEffect(() => {
		
	}, []);

	async function login() {
		try {
			const user = {
				name: name,
				password: password
			}
			const response = await axios.post(`${SERVER_URL}/login`, user);
			await save_user_id(response.data);
			
			console.log(`Retrieved user id: "${response.data}"`);

			// Sends the client to the marketplace page
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
		// Clears the error message
		set_error_message("");
		router.push("/(tabs)/(register)");
	};

	return (
		<SafeAreaView style={styles.container}>
		  {/* Company logo */}
		  <Image source={require("./../../assets/images/bb_logo.svg")} style={styles.icon} />
	  
		  <Text style={styles.title}>Logga in</Text>
	  
		  {/* Username Input */}
		  <TextInput
			style={styles.input}
			placeholder="Användarnamn"
			placeholderTextColor="#888"
			value={name}
			onChangeText={set_name}
		  />
	  
		  {/* Password Input */}
		  <TextInput
			style={styles.input}
			placeholder="Lösenord"
			placeholderTextColor="#888"
			secureTextEntry
			value={password}
			onChangeText={set_password}
		  />
	  
		  {/* Error Message */}
	  
		  {/* Login Button */}
		  <TouchableOpacity style={styles.button} onPress={handle_login}>
			<Text style={styles.buttonText}>Logga in</Text>
		  </TouchableOpacity>
		  {error_message ? <Text style={styles.errorText}>{error_message}</Text> : null}
	  
		  {/* Register Button */}
			  <TouchableOpacity style={styles.button} onPress={handle_register}>
			<Text style={styles.buttonText}>Har du inget konto? Registera dig här</Text>
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
		transform: [{ translateX: -100 }], // needs to be half the width
	  },
	  title: {
		fontSize: 30,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 0,
	  },
	  input: {
		width: "80%",
		height: 50,
		backgroundColor: "#FFF",
		borderWidth: 1,
		borderColor: "#DDD",
		borderRadius: 10,
		paddingHorizontal: 15,
		marginVertical: 10,
	  },
	  forgotPassword: {
		color: "#007AFF",
		fontSize: 14,
		marginBottom: 15,
	  },
	  button: {
		width: "80%",
		backgroundColor: "#007AFF",
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 15,
	  },
	  buttonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
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
		fontSize: 14,
		marginTop: 5,
		fontStyle: "italic",
	  },
	});