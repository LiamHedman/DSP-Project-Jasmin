import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import Mapbox, { MapView } from "@rnmapbox/maps";
import { button_two_choice as Button_tc } from "@/assets/ui_elements/buttons";

Mapbox.setAccessToken("pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205Z3Q4azlpMXN6cTJrcXc3anNhN2d2eCJ9.gYQgEn_h2O1CGIxWkEpcdA");
import { Supply_post } from "./../../../classes_tmp";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

	const handle_visit_post = async (post_id: string) => {
		try {
			await AsyncStorage.setItem("post_id", post_id);
			router.push("/(tabs)/(supply_posts)/post_page");
		} catch (error) {
			console.error("Failed to store post ID:", error);
		}
	};
	const [selected_category, set_selected_category] = useState("till salu");
	const [selected_sub_category, set_selected_sub_category] = useState("varor");

	return (
		<ScrollView>
			<SafeAreaView style={styles.container}>

				{/* Map Section */}
				{/* 				<View style={styles.mapContainer}>
					<MapView />
				</View> */}
				<Text style={styles.title2}>{"Sortera annonser"}</Text>
				<View style={styles.sorting_container}>
					<View style={styles.sorting_button_container}>
						<Button_tc title="Till salu" onPress={() => set_selected_category("till salu")} selected={selected_category === "till salu"} variant="left" />
						<Button_tc title="Efterfrågas" onPress={() => set_selected_category("efterfrågas")} selected={selected_category === "efterfrågas"} variant="right" />
					</View>

					<View style={styles.sorting_button_container}>
						<Button_tc title="Varor" onPress={() => set_selected_sub_category("varor")} selected={selected_sub_category === "varor"} variant="left" />
						<Button_tc title="Tjänster" onPress={() => set_selected_sub_category("tjänster")} selected={selected_sub_category === "tjänster"} variant="right" />
					</View>
				</View>

				<Text style={styles.title2}>{"Annonser"}</Text>

				{/* Posts list */}
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
								{/* 								<TouchableOpacity style={styles.saveButton}><Text style={styles.saveButtonText}>Spara annons</Text></TouchableOpacity>
								<TouchableOpacity style={styles.visitButton} onPress={() => handle_visit_post(post?.id)}><Text style={styles.visitButtonText}>Besök annons</Text></TouchableOpacity>
 */}							</View>
						))}
					</ScrollView>
				</View>

				{/* Action buttons */}
				<TouchableOpacity style={styles.button} onPress={handle_temporary}><Text style={styles.buttonText}>temp</Text></TouchableOpacity>
			</SafeAreaView>
		</ScrollView>
	);
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 50,
		backgroundColor: "#ffffff",
		alignItems: "center",
	},

	sorting_container: {
		flex: 1,
		width: "80%",
		alignItems: "center",
		marginBottom: 10,
	},
	sorting_button_container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: "100%",
		marginBottom: 20,
	},

	mapContainer: {
		width: "90%",
		height: 150,
		margin: 12,
		borderRadius: 5,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: "#ccc",
		alignSelf: "center",
	},
	map: {
		flex: 1,
	},
	input: {
		width: "90%",
		height: 35,
		margin: 6,
		borderWidth: 1,
		color: "#949494",
		padding: 10,
		borderRadius: 5,
		backgroundColor: "white",
		alignSelf: "center",
	},
	button: {
		width: "90%",
		backgroundColor: '#007AFF',
		paddingVertical: 6,
		borderRadius: 5,
		elevation: 5,
		alignItems: 'center',
		margin: 5,
	},
	buttonText: {
		color: "#FFF",
		fontSize: 14,
	},
	title2: {
		fontWeight: "bold",
		fontSize: 24,
		marginBottom: 10,
	},
	postsWrapper: {
		borderRadius: 10,
		width: "100%",
		elevation: 5,
		marginBottom: 20,
	},
	postsContainer: {
		width: "100%",
	},
	post: {
		borderColor: "#CFCECE",
		borderBottomWidth: 1,
		borderTopWidth: 1,
		backgroundColor: "#FFF",
		padding: 20,
	},
	postInfo: {
		flexDirection: "row",
		justifyContent: "flex-start",
		width: "100%",
	},
	postIcon: {
		width: 150,
		height: 150,
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
		fontSize: 26,
	},
	postDescription: {
		fontSize: 14,
		color: "#555",
	},
	postCategory: {
		fontSize: 16,
		fontStyle: "italic",
	},
	postPrice: {
		fontSize: 18,
		fontStyle: "italic",
		position: "absolute",
		bottom: 0,
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
