import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { get_user_id } from "@/auth_token";
import axios from "axios";
import { Supply_post, User } from "@/classes_tmp";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserProfilePage() {
	const SERVER_URL = "http://localhost:3000";

	const empty_user = new User("", "", "", "", "", "", "", "", "", "");
	const [user, set_user] = useState<User>(empty_user);
	const [posts, set_posts] = useState<Supply_post[]>([]);

	async function fetch_user() {
		try {
			const response = await axios.get(`${SERVER_URL}/fetch_user`, { headers: { auth: `${await get_user_id()}` } });
			set_user(response.data);
		} catch (error: any) {
			console.error("Failed to fetch user info:", error.message);
		}
	}

	async function fetch_supply_posts() {
		try {
			const response = await axios.get(`${SERVER_URL}/fetch_my_supply_posts`, { headers: { auth: `${await get_user_id()}` } });
			console.log(response.data);
			set_posts(response.data);
		} catch (error: any) {
			console.error("Failed to fetch supply posts:", error.message);
		}
	}

	async function delete_supply_post(post_id: string) {
		try {
			const response = await axios.post(`${SERVER_URL}/delete_supply_post`, { id: post_id });

			// Updates the table of posts after successfull deletion
			if (response.status === 200) {
				await fetch_supply_posts();
			}

		} catch (error: any) {
			console.error("Failed to delete post");
		}
	}

	const handle_supply_post_deletion = async (post_id: string) => {
		await delete_supply_post(post_id);
	};

	const handle_edit_profile = async () => {
		router.push("/(tabs)/(user_profile)/edit_user_profile");
	};

	const handle_create_supply_post = async () => {
		router.push("/(tabs)/(supply_posts)/create_supply_post");
	};

	const handle_logout = async () => {
		await AsyncStorage.removeItem("user_id");
		router.replace("/");
	};

	useEffect(() => {
		fetch_user();
		fetch_supply_posts();
	}, []);

	return (
		<ScrollView>
			<SafeAreaView style={styles.container}>
				{/* Profile container */}
				<View style={styles.profileContainer}>
					<View style={styles.profileInfo}>
						{/* Profile pic */}
						<Image
							source={{ uri: `https://api.dicebear.com/7.x/micah/svg?seed=${user.id}` }}
							style={styles.profileImage}
						/>
						{/* User info */}
						<View style={styles.userInfo}>
							<Text style={styles.userName}>{user.name}</Text>

							<View style={styles.bioContainer}>
								<Text style={styles.userBio}>{user.bio}</Text>
							</View>

							<Text style={styles.userDetails}>{user.phone_number}</Text>
							<Text style={styles.userDetails}>{user.mail}</Text>
							<Text style={styles.userDetails}>{user.address}</Text>
							<Text style={styles.userDetails}>{user.date_of_birth}</Text>
						</View>

					</View>
					{/* User action buttons */}
					<TouchableOpacity style={styles.button} onPress={handle_edit_profile}>
						<Text style={styles.buttonText}>Redigera profil</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.button} onPress={handle_create_supply_post}><Text style={styles.buttonText}>Skapa en annons (temp)</Text></TouchableOpacity>
					<TouchableOpacity style={styles.logoutButton} onPress={handle_logout}><Text style={styles.buttonText}>Logga ut</Text></TouchableOpacity>
				
				</View>

				{/* The users posts */}
				<Text style={styles.title2}>{"Mina annonser"}</Text>

				<View style={styles.postsWrapper}>
					<ScrollView style={styles.postsContainer}>
						{posts.map((post, index) => (
							<View style={styles.post} key={index}>
								<View style={styles.postInfo}>
									{/* Post icon */}
									<View style={styles.postIcon}>
										<Image
											source={{ uri: post.post_picture_url }}
											style={styles.postIcon}
										/>
									</View>
									{/* Post info */}
									<View style={styles.postTexts}>

										<Text style={styles.postTitle}>{post.title}</Text>
										<Text style={styles.postCategory}>{post.category}</Text>
										<Text style={styles.postDescription}>{post.description}</Text>
									</View>
								</View>
								{/* Post buttons */}
								<TouchableOpacity style={styles.deleteButton} onPress={() => handle_supply_post_deletion(post?.id)}>
									<Text style={styles.deleteButtonText}>Radera annons</Text>
								</TouchableOpacity>
							</View>
						))}
					</ScrollView>
				</View>
			</SafeAreaView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F8F8",
		alignItems: "center",
	},
	title2: {
		fontWeight: "bold",
		fontSize: 24,
		marginBottom: 10,
	},
	profileContainer: {
		alignItems: "center",
		backgroundColor: "#FFF",
		padding: 20,
		borderRadius: 15,
		marginTop: 40,
		marginBottom: 40,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5,
		width: "90%",

	},
	profileInfo: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 40,
		marginRight: 30,
	},
	userInfo: {
		flex: 1,
		flexDirection: "column"
	},
	userName: {
		fontSize: 22,
		fontWeight: "bold",
	},
	userDetails: {
		fontSize: 16,
		color: "#888",
	},
	userBio: {
		fontSize: 14,
		fontStyle: "italic",
		color: "#555",
	},
	bioContainer: {
		overflow: "hidden",
	},
	postsWrapper: {
		backgroundColor: "#EAEAEA", // Light gray container for posts
		padding: 15,
		borderRadius: 10,
		width: "90%",
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5,
		marginBottom: 20,
	},
	postsContainer: {
		width: "100%",
	},
	post: {
		backgroundColor: "#FFF",
		padding: 15,
		marginVertical: 10,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5,
	},
	postInfo: {
		flexDirection: "row",
		justifyContent: "flex-start",
		width: "100%",
	},
	postIcon: {
		width: 130,
		height: 130,
		marginRight: 15,
		borderRadius: 25,
	},
	postTexts: {
		flexDirection: "column",
		justifyContent: "flex-start",
		width: "100%",
	},
	postTitle: {
		fontWeight: "bold",
		fontSize: 24,
	},
	postDescription: {
		fontSize: 14,
		color: "#555",
	},
	postCategory: {
		fontSize: 14,
		fontStyle: "italic",
	},
	deleteButton: {
		backgroundColor: "#ff4d4d",
		paddingVertical: 8,
		borderRadius: 6,
		alignItems: "center",
		marginTop: 10,
	},
	deleteButtonText: {
		color: "#FFF",
		fontWeight: "bold",
	},
	logoutButton: {
		width: "100%",
		backgroundColor: "#ff0000",
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 15,
	},
	button: {
		width: "100%",
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
});
