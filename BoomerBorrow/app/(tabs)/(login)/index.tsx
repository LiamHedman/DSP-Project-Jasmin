import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import * as WebBrowser from "expo-web-browser"; //to open the Google sign-in 
import * as Google from 'expo-auth-session/providers/google' // a Google OAuth helper 
import AsyncStorage from "@react-native-async-storage/async-storage" // to persist user data on the device 

// Clean up any in-progress or backgrounded auth sessions (e.g., if the app was closed during login).
WebBrowser.maybeCompleteAuthSession();

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

	// ** Google Auth **
	// Currently logged-in user's info, once retrieved from Google or local storage.
	const [userInfo, setUserInfo] = useState(null);
	
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
	  handleSignInWithGoogle()
	}, [response])

	// Checks if user info is already stored in AsyncStorage:
	async function handleSignInWithGoogle(){
	  const user = await AsyncStorage.getItem("@user");
	  // if not in storage, retreive and set the info via getUserInfo function
	  if (!user){
		if(response?.type === "success"){
		  await getUserInfo(response.authentication!.accessToken!); 
		}
	  }
	  // if in storage, change the constant userInfo
	  else{
		setUserInfo(JSON.parse(user));
	  }
	}
  
	const getUserInfo = async (token: string) => {
	  if (!token) return;
	  try {
		// Uses the OAuth token to fetch the user's Google profile.
		const response = await fetch(
		  "https://www.googleapis.com/userinfo/v2/me",
		  {
			headers: { Authorization: `Bearer ${token}` },
		  }
		);
  
		const user = await response.json();
		// Saves it to AsyncStorage
		await AsyncStorage.setItem("@user", JSON.stringify(user));

		//Updates state with the user data
		setUserInfo(user);
	  } catch (error) {
  
	  }
	}

	// ** End Google Auth **

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
		{/* GOOGLE AUTH */}
		<Text>{JSON.stringify(userInfo, null, 2)}</Text>
		<Button title="Sign in with Google" onPress={() => promptAsync()} />
		<Button title="Delete local storage" onPress={() => AsyncStorage.removeItem("@user")} />
		{/* END GOOGLE AUTH */}

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