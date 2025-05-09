import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { User } from "./../../../classes_tmp";

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

	async function register_user() {
		try {
			user = new User(role, name,	mail, phone_number,	bio, address, date_of_birth, profile_picture_url, password);
			await axios.post(`${SERVER_URL}/register_user`, user);
			router.push("/(tabs)/(login)");
		} catch (error: any) {
			// TODO: NOTIFY the user upon failed attempt
			console.error("Registration failed:", error.message);
		}
	}

	const handle_register = async () => {
		await register_user();
	};

	return (
		<SafeAreaView style={styles.container}>

		  <Text style={styles.title}>Registrera dig</Text>
	
		  {/* Name Input */}
		  <TextInput
			style={styles.input}
			placeholder="Namn"
			placeholderTextColor="#888"
			value={name}
			onChangeText={set_name}
		  />
	
		  {/* Email Input */}
		  <TextInput
			style={styles.input}
			placeholder="E-post"
			placeholderTextColor="#888"
			keyboardType="email-address"
			value={mail}
			onChangeText={set_mail}
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
			<Text style={styles.buttonText}>Registrera</Text>
		  </TouchableOpacity>
	
		  {/* Login Link */}
		  <TouchableOpacity style={styles.linkButton}>
			<Text style={styles.linkText}>Har du redan ett konto? Logga in här</Text>
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
	});