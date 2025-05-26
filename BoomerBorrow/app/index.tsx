import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, StyleSheet, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { User } from "../classes_tmp";
import { save_user_id, save_user_name } from "@/auth_token";
import { Image } from "react-native";
import * as WebBrowser from "expo-web-browser"; //to open the Google sign-in 
import * as Google from 'expo-auth-session/providers/google' // a Google OAuth helper 
import AsyncStorage from "@react-native-async-storage/async-storage" // to persist user data on the device
import { v4 as uuidv4 } from 'uuid';

// Clean up any in-progress or backgrounded auth sessions (e.g., if the app was closed during login).
WebBrowser.maybeCompleteAuthSession();

import { button as Button } from "@/assets/ui_elements/buttons";
import { input_common as Input_common } from "@/assets/ui_elements/text_inputs";

export default function LoginScreen() {
	const SERVER_URL = "http://localhost:3000";

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
	const [created_at, set_created_at] = useState("");

	const [error_message, set_error_message] = useState("");

	const [users, set_users] = useState<User[]>([]);

	async function login() {
		try {
			const user = { name: name, password: password }
			const response = await axios.post(`${SERVER_URL}/login`, user);
			await save_user_id(response.data[0].id)
			await save_user_name(response.data[0].name)

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
		router.push("/(tabs)/(marketplace)");
		//await login();
	};

	const handle_register = async () => {
		set_error_message("");
		router.push("/(register)");
	};

	async function sign_in(user: any) {
        const parsed_user = JSON.parse(user);
        // To set a random, non-guessable password
        set_password(uuidv4());

        try {
            let response = await axios.post(`${SERVER_URL}/google_sign_in`, {}, { headers: { auth: `${parsed_user.email}` } });
            const user_exists: boolean = response.data.length;
            if (!user_exists) {
                const new_user = new User("google", role, parsed_user.name, parsed_user.email, phone_number, bio, address, date_of_birth, profile_picture_url, password);
                response = await axios.post(`${SERVER_URL}/register_user`, new_user);
                console.log("response1; ", JSON.stringify(response));
                console.log("response1 id; ",JSON.stringify(response.data));

                await save_user_id(response.data[0].id)
                await save_user_name(response.data[0].name)
            } else {
				await save_user_id(response.data[0].id)
                await save_user_name(response.data[0].name)
            }
            router.push("/(tabs)/(marketplace)");
        } catch (error: any) {
            if (error.response) {
                switch (error.response.status) {
                    case 419:
                        set_error_message("Mailaddressen finns registrerad, men är ej kopplad till Google");
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

	// ** Google Auth **
	// Currently logged-in user's info, once retrieved from Google or local storage.
	const [userInfo, setUserInfo] = useState("");

	// Sets up the Google OAuth request.
	const [request, response, promptAsync] = Google.useAuthRequest({
		androidClientId:
			"190831489599-noj666k9inta2o3865e0et5ggriobhg5.apps.googleusercontent.com",
		iosClientId:
			"190831489599-7nl4gjpjvpaqh5ik5laek7de6anb7ets.apps.googleusercontent.com",
		webClientId:
			"190831489599-27e7o2ndm9tb944thff2ovgggqbfjs2k.apps.googleusercontent.com"
	});


	//handleSignInWithGoogle is run when response is changed 
	//i.e. after a Google login completes when promptAsync() is done
	useEffect(() => {
		if (response?.type === "success") {
			handleSignInWithGoogle();
		}
	}, [response]);


	// Checks if user info is already stored in AsyncStorage:
	async function handleSignInWithGoogle() {
		if (response?.type === "success") {
			const token = response.authentication?.accessToken;
			if (!token) {
				console.error("No access token found");
				return;
			}

			await getUserInfo(token);

			const storedUser = await AsyncStorage.getItem("@user");
			if (storedUser) {
				setUserInfo(JSON.parse(storedUser));
				await sign_in(storedUser);
			} else {
				console.error("User info not found after Google sign-in");
			}
		}
	}



	const getUserInfo = async (token: string) => {
		if (!token) return;
		try {
			const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
				headers: { Authorization: `Bearer ${token}` },
			});

			const user = await response.json();

			if (!user?.email || !user?.name) {
				console.error("Incomplete user info from Google:", user);
				return;
			}

			await AsyncStorage.setItem("@user", JSON.stringify(user));
			setUserInfo(user);
		} catch (error) {
			console.error("Failed to fetch user info:", error);
		}
	};

	// ** End Google Auth **

	return (
		<SafeAreaView style={styles.container}>
			{/* Company logo */}
			<Image source={require("./../assets/images/bb_logo.svg")} style={styles.icon} />

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

			{/* GOOGLE AUTH */}
			<TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
				<Text style={styles.buttonText}>Logga in/registrera med Google</Text>
			</TouchableOpacity>

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
		marginTop: 10,
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
	error_text: {
		color: "red",
		fontSize: 14,
		marginTop: 5,
		fontStyle: "italic",
	},
});