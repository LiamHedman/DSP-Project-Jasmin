import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
// import MapView from './MapView'; // Import from same directory
import Mapbox, { MapView, Camera } from "@rnmapbox/maps";

// Set the Mapbox access token
Mapbox.setAccessToken("pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205Z3Q4azlpMXN6cTJrcXc3anNhN2d2eCJ9.gYQgEn_h2O1CGIxWkEpcdA");
import { Supply_post } from "./../../../classes_tmp";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import token_storage from "@/token_storage";

export default function MarketplaceScreen() {
	const SERVER_URL = "http://localhost:3000";


	// All the supply posts gets stored here
	const [posts, set_posts] = useState<Supply_post[]>([]);

	async function fetch_active_supply_posts() {
		try {
			const response = await axios.get(`${SERVER_URL}/fetch_all_supply_posts`);
			set_posts(response.data);
		} catch (error: any) {
			console.error("Failed to fetch active_supply_posts:", error.message);
		}
	}

	// Runs on page mount
	useEffect(() => {
		fetch_active_supply_posts();
	}, []);

	const handle_temporary = async () => {
		router.push("/(tabs)/(user_profile)/user_profile_page");
	};
	
const handle_visit_post = async (post_id: string, owner_id: string) => {
    try {
        //await AsyncStorage.setItem("post_id", post_id);
        //router.push("/(tabs)/(supply_posts)/post_page");
        router.push({
                pathname: "/(tabs)/(chat)/ChatListScreen",
                params: {
                  owner_id: owner_id,
                },
              });
    } catch (error) {
        console.error("Failed to store post ID:", error);
    }
};

	

/* 	async function delete_supply_post(post_id: string) {
		try {
			const response = await axios.post(`${SERVER_URL}/delete_supply_post`, { id: post_id });

			if (response.status === 200) {
				await fetch_active_supply_posts();
			}

		} catch (error: any) {
			console.error("Failed to delete post");
		}
	} */
/* 
	const handle_supply_post_deletion = async (post_id: string) => {
		await delete_supply_post(post_id);
	}; */

/* 	async function edit_supply_post(post_id: string) {
		try {

			const new_post_data = {
				id: post_id,    // ID
				owner_id: "10",    // Owner ID
				title: title,   // title
				description: description,    // description
				price: price,    // price
				category: category,   // category
				location: location,   // location
				post_picture_url: post_picture_url,   // post_picture_url
				created_at: "tmp"    // 
			};

			const response = await axios.post(`${SERVER_URL}/edit_supply_post`, new_post_data);

			if (response.status === 200) {
				await fetch_active_supply_posts();
			}

		} catch (error: any) {
			console.error("Failed to delete post");
		}
	} */

/* 	const handle_supply_post_editing = async (post_id: string) => {
		await edit_supply_post(post_id);
	}; */

	return (
		<ScrollView>
			<SafeAreaView style={styles.container}>

				{/* Map Section */}
				<View style={styles.mapContainer}>
					<MapView />
				</View>

				<Text style={styles.title2}>{"Annonser"}</Text>

				{/* Posts List */}
				<View style={styles.postsWrapper}>
					<ScrollView style={styles.postsContainer}>
						{posts.map((post, index) => (
							<View style={styles.post} key={index}>
								<View style={styles.postInfo}>
									<View style={styles.postIcon}>
										<Image
											source={{ uri: `https://api.dicebear.com/7.x/icons/svg?seed=${post?.id}` }}
											style={styles.postIcon}
										/>
									</View>
									<View style={styles.postTexts}>
										<Text style={styles.postTitle}>{post.title}</Text>
										<Text style={styles.postCategory}>{post.category}</Text>
										<Text style={styles.postDescription}>{post.description}</Text>
										<Text style={styles.postPrice}>{(Number(post.price)).toLocaleString("sv-SE") + " kr"}</Text>
									</View>
								</View>
								<TouchableOpacity style={styles.saveButton}><Text style={styles.saveButtonText}>Spara annons</Text></TouchableOpacity>
								<TouchableOpacity style={styles.visitButton}onPress={() => handle_visit_post(post?.id, post.owner_id)}><Text style={styles.visitButtonText}>Besök annons</Text></TouchableOpacity>
							</View>
						))}
					</ScrollView>
				</View>

				{/* Button */}
				<TouchableOpacity style={styles.button} onPress={handle_temporary}><Text style={styles.buttonText}>temp</Text></TouchableOpacity>
			</SafeAreaView>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: "#ffffff",
		alignItems: "center", // Center children horizontally
	},
	postOwner: {
		fontSize: 14,
		fontStyle: "italic",
		color: "#888",
		marginTop: 4,
	},
	mapContainer: {
		width: "90%",
		height: 150,
		margin: 12,
		borderRadius: 5,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "#ccc",
		alignSelf: "center", // Ensure map is centered
	},
	map: {
		flex: 1,
	},
	input: {
		width: "90%", // Match other components
		height: 35,
		margin: 6,
		borderWidth: 1,
		color: "#949494",
		padding: 10,
		borderRadius: 5,
		backgroundColor: "white",
		alignSelf: "center", // Ensure inputs are centered
	},
	button: {
		width: "90%",
		backgroundColor: '#007AFF', // Button color
		paddingVertical: 6, // Vertical padding for height
		borderRadius: 5, // Rounded corners (adjust as needed)
		elevation: 5,
		alignItems: 'center',
		margin: 5,
	},
	buttonText: {
		color: "#FFF",
		fontSize: 14,
	},
	minibutton: {
		backgroundColor: '#ff4155', // Button color
		paddingVertical: 2, // Vertical padding for height
		paddingHorizontal: 5, // Horizontal padding for width
		borderRadius: 5, // Rounded corners (adjust as needed)
		elevation: 5,
		alignItems: 'center',
		margin: 2,
	},
	title2: {
		fontWeight: "bold",
		fontSize: 24,
		marginBottom: 10,
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
		width: 100,
		height: 100,
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
		fontSize: 20,
	},
	postDescription: {
		fontSize: 14,
		color: "#555",
	},
	postCategory: {
		fontSize: 14,
		fontStyle: "italic",
	},
	postPrice: {
		fontSize: 14,
		fontStyle: "italic",
		position: "absolute",
		bottom: 0,
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
	saveButton: {
		backgroundColor: "#FF0022",
		paddingVertical: 8,
		borderRadius: 6,
		alignItems: "center",
		marginTop: 10,
	},
	saveButtonText: {
		color: "#FFF",
		fontWeight: "bold",
	},
	visitButton: {
		backgroundColor: "#007AFF",
		paddingVertical: 8,
		borderRadius: 6,
		alignItems: "center",
		marginTop: 10,
	},
	visitButtonText: {
		color: "#FFF",
		fontWeight: "bold",
	},
});