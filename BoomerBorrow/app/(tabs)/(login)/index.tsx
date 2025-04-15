import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import axios from "axios";

export default function LoginScreen() {
	const SERVER_URL = "http://localhost:3000";

	// use set_username() or set_password() if you want to update the username or password 
	const [username, set_username] = useState("");
	const [password, set_password] = useState("");

	// If you need to execute something on page mount (when you load the page)
	useEffect(() => {
		
	}, []);

	async function login(username: string) {
		try {
			const response = await axios.post(`${SERVER_URL}/login`, {
			username: username,
			});
		} catch (error: any) {
			console.error("Login failed:", error.message);
		}
	}

	// Handles a clients login when the login button is pressed
	const handle_login = async () => {
		console.log("Username:", username);
		console.log("Password:", password);
		await login(username);
		// Sends the client to the marketplace page
		router.push("../(marketplace)");
	};

	return (
	<SafeAreaView style={styles.container}>
		<TextInput
		style={styles.input}
		placeholder="Enter username"
		value={username}
		onChangeText={set_username} // Updates state
		/>

		<TextInput
		style={styles.input}
		placeholder="Enter password"
		value={password}
		secureTextEntry
		onChangeText={set_password} // Updates state
		/>
		<Button 
		title="Log in" 
		onPress={handle_login}
		/>
	</SafeAreaView>
	);
	}

	const styles = StyleSheet.create({
	container: {
	flex: 1,
	justifyContent: "center",
	alignItems: "center",
	},
	input: {
	height: 40,
	width: "80%",
	margin: 12,
	borderWidth: 1,
	padding: 10,
	borderRadius: 5,
	},
});