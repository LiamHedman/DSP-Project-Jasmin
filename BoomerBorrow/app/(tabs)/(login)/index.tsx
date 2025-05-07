import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { User } from "./../../../classes_tmp";
import token_storage from "@/token_storage";

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
			token_storage.store_token(response.data);
			console.log(`Stored auth_token: ${response.data}`);

			// Sends the client to the marketplace page
			router.push("/(tabs)/(marketplace)");
		} catch (error: any) {
			console.error("Login failed:", error.message);
		}
	}

	// Handles a clients login when the login button is pressed
	const handle_login = async () => {
		console.log("Username:", name);
		console.log("Password:", password);
		await login();
	};

	const handle_register = async () => {
		router.push("/(tabs)/(register)");
	};

	return (
	<SafeAreaView style={styles.container}>
		
		<Text>Log in</Text>

		<TextInput
		style={styles.input}
		placeholder="Enter username"
		value={name}
		onChangeText={set_name} // Updates state
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

		<Button 
		title="I don't have an account" 
		onPress={handle_register}
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