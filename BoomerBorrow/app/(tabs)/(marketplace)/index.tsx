import React, { ReactNode, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from "react-native";
import axios from "axios";
import Mapbox, { MapView, Camera, MarkerView } from "@rnmapbox/maps";
import * as Location from "expo-location";
import { button as Button, button_two_choice as Button_tc } from "@/assets/ui_elements/buttons";

Mapbox.setAccessToken("pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA");
import { Supply_post } from "./../../../classes_tmp";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { log } from "console";

export default function MarketplaceScreen() {
	const SERVER_URL = "http://localhost:3000";

	// All the supply posts gets stored here
	const [posts, set_posts] = useState<Supply_post[]>([]);
	//const [location, set_location] = useState<Location.LocationObject | null>(null);
	const [location, set_location] = useState("");
	const [user_location, set_user_location] = useState<[number, number] | null>(null);
	const [searchText, setSearchText] = useState("");
	const [cameraCoords, setCameraCoords] = useState<[number, number] | null>(null);
	const [cameraKey, setCameraKey] = useState(0);
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
		fetchUserLocation();
	}, []);
	async function fetchUserLocation() {
		try {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.warn("Permission to access location was denied");
				return;
			}
			const userLoc = await Location.getCurrentPositionAsync({});
			const coords: [number, number] = [userLoc.coords.longitude, userLoc.coords.latitude];
			set_user_location(coords);
			setCameraCoords(coords);
			setCameraKey((prev) => prev + 1); // force camera update on location fetch
		} catch (error) {
			console.error("Error getting user location:", error);
		}
	}


	const handle_temporary = async () => {
		router.push("/(tabs)/(user_profile)");
	};

const handle_visit_post = async (post_id: string, owner_id: string, owner_name: string) => {
	console.log("owner_id: " + owner_id);
	console.log("owner_name: " + owner_name);
    try {
        await AsyncStorage.setItem("post_id", post_id);
        router.replace({
                pathname: "/(tabs)/(supply_posts)/post_page",
                params: {
					post_id: post_id,
					owner_id: owner_id,
					owner_name: owner_name,
				},
			});

		} catch (error) {
			console.error("Failed to store post ID:", error);
		}
	};

	const [selected_category, set_selected_category] = useState("till uthyrning");
	const [selected_sub_category, set_selected_sub_category] = useState("varor");
	const [searchQuery, setSearchQuery] = useState("");

	function handleCitySearch() {
		if (!searchText.trim()) return;
		// Use Mapbox Geocoding API to get coordinates for the city
		const MAPBOX_TOKEN = "pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA";
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=SE`;
		axios.get(url)
			.then(res => {
				const features = res.data.features;
				if (features && features.length > 0) {
					const [lng, lat] = features[0].center;
					setCameraCoords([lng, lat]);
					setCameraKey(prev => prev + 1); // force camera update
				} else {
					alert("Stad hittades inte.");
				}
			})
			.catch(() => {
				alert("Fel vid sökning av stad.");
			});
	}

	return (
		<ScrollView>
			<SafeAreaView style={styles.container}>

{/* Search Bar */}
	  <View style={styles.searchContainer}>
		<TextInput
		  style={styles.searchInput}
		  placeholder="Sök efter stad..."
		  value={searchText}
		  onChangeText={setSearchText}
		  onSubmitEditing={handleCitySearch}
		/>
		<TouchableOpacity onPress={handleCitySearch} style={styles.searchButton}>
		  <Text style={{ color: "white" }}>Sök</Text>
		</TouchableOpacity>
	  </View>
	  {/* Your Location Button */}
	  <TouchableOpacity
		onPress={fetchUserLocation}
		style={{
		  backgroundColor: "#007AFF",
		  padding: 10,
		  borderRadius: 5,
		  marginBottom: 10,
		  alignSelf: "center",
		  width: "90%",
		  alignItems: "center",
		}}
	  >
		<Text style={{ color: "white" }}>Your Location</Text>
	  </TouchableOpacity>
	  {/* Map Section */}
	  <View style={styles.mapContainer}>
		<MapView style={styles.map}>
		  {cameraCoords && (
			<Camera
			  key={cameraKey}
			  centerCoordinate={cameraCoords}
			  zoomLevel={15}
			  animationMode="flyTo"
			  animationDuration={1000}
			/>
		  )}
		  {posts.map((p, i) => {
			const coords = p.location.split(",").map((n) => parseFloat(n));
			const isValidCoords = coords.length === 2 && coords.every((c) => !isNaN(c));

			return isValidCoords ? (
				<MarkerView key={i} coordinate={[coords[0], coords[1]]}>
					<TouchableOpacity
						onPress={() =>
							router.push({
								pathname: "/(tabs)/(supply_posts)/post_page",
								params: {
									post_id: p.id,
									owner_id: p.owner_id,
									owner_name: p.owner_name,
								},
							})
						}
					>
						<View style={{ backgroundColor: "blue", padding: 4, borderRadius: 6 }}>
							<Text style={{ color: "white", fontSize: 10 }}>{p.title}</Text>
						</View>
					</TouchableOpacity>
				</MarkerView>
			) : null;
		})}
		  {/* Extra markers from second code */}
		  {user_location && (
			<MarkerView coordinate={user_location}>
			  <View style={{ backgroundColor: "red", padding: 5, borderRadius: 10 }}>
				<Text style={{ color: "white", fontSize: 1 }}>*</Text>
			  </View>
			</MarkerView>
		  )}
		</MapView>
				</View> */
				<Text style={styles.title2}>{"Sortera annonser"}</Text>
				<View style={button_styles.sorting_container}>
					<View style={button_styles.sorting_button_container}>
						<Button_tc title="Till uthyrning" onPress={() => set_selected_category("till uthyrning")} selected={selected_category === "till uthyrning"} variant="left" />
						<Button_tc title="Efterfrågas" onPress={() => set_selected_category("efterfrågas")} selected={selected_category === "efterfrågas"} variant="right" />
					</View>

					<View style={button_styles.sorting_button_container}>
						<Button_tc title="Varor" onPress={() => set_selected_sub_category("varor")} selected={selected_sub_category === "varor"} variant="left" />
						<Button_tc title="Tjänster" onPress={() => set_selected_sub_category("tjänster")} selected={selected_sub_category === "tjänster"} variant="right" />
					</View>
					<TextInput
						style={button_styles.searchBar}
						placeholder="Sök..."
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</View>

				<Text style={styles.title2}>{"Annonser"}</Text>

				{/* Posts list */}
				<View style={styles.postsWrapper}>
					<ScrollView style={styles.postsContainer}>
						{posts.map((post, index) => (
							<View style={styles.post} key={index}>
								<TouchableOpacity key={index} onPress={() => handle_visit_post(post.id, post.owner_id, post.owner_name)}>
									<View style={styles.postInfo}>
										<View style={styles.postIcon}>
											<Image
												source={{ uri: post?.post_picture_url }}
												style={styles.postIcon}
											/>
										</View>
										<View style={styles.postTexts}>
											<Text style={styles.postCategoryType}>{post.category_type}</Text>
											<Text style={styles.postTitle}>{post.title}</Text>
											<Text style={styles.postCategory}>{post.category}</Text>
											<Text style={styles.postDescription} numberOfLines={2} ellipsizeMode="tail">{post?.description}</Text>
											<Text style={styles.postPrice}>{(Number(post.price)).toLocaleString("sv-SE") + " kr" + (post.category_type === "Uthyrning" ? "/dag" : "")}</Text>
										</View>
									</View>
								</TouchableOpacity>
							</View>
						))}
					</ScrollView>
				</View>

				{/* Action buttons */}
				<Button title="Användarprofil (temp)" on_press={handle_temporary} variant="visit" bottom_margin={15} />
			</SafeAreaView>
		</ScrollView>
	);
}

const button_styles = StyleSheet.create({
	sorting_container: {
		flex: 1,
		width: "90%",
		alignItems: "center",
		marginBottom: 10,
	},
	sorting_button_container: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: "100%",
		marginBottom: 10,
	},

	searchBar: {
		fontSize: 18,
		height: 50,
		width: "100%",
		borderWidth: 2,
		borderColor: "#000",
		borderRadius: 50,
		paddingHorizontal: 20,
		marginBottom: 10,
	},
})


const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 20,
		backgroundColor: "#ffffff",
		alignItems: "center",
	},
	mapContainer: {
		width: "90%",
		height: 250,
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
	minibutton: {
		backgroundColor: "#007AFF",
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
		alignSelf: "center",
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		width: "90%",
		marginBottom: 10,
	},
	searchInput: {
		flex: 1,
		height: 40,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
		marginRight: 10,
	},
	searchButton: {
		backgroundColor: "#007AFF",
		padding: 10,
		borderRadius: 5,
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
		fontSize: 32,
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
		width: "60%",
	},
	postCategoryType: {
		fontSize: 14,
		marginBottom: -10,
	},
	postTitle: {
		fontWeight: "bold",
		fontSize: 32,
		marginBottom: -5,
	},
	postDescription: {
		fontSize: 16,
		color: "#555",
	},
	postCategory: {
		fontSize: 20,
		fontStyle: "italic",
	},
	postPrice: {
		fontSize: 20,
		fontWeight: "bold",
		position: "absolute",
		bottom: 0,
	},
});
