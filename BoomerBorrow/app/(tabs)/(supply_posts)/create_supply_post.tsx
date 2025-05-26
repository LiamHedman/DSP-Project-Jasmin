import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Supply_post } from "@/classes_tmp";
import { get_user_id, get_user_name } from "@/auth_token";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import Mapbox, { MapView, MarkerView, Camera } from "@rnmapbox/maps";

Mapbox.setAccessToken("pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA");

export default function CreateAd() {
	const params = useLocalSearchParams();
	const SERVER_URL = "http://localhost:3000";
	const { image_uri } = useLocalSearchParams();
	useEffect(() => {
    	if (image_uri && typeof image_uri === "string") {
        	set_post_picture_url(image_uri);
    	}
    }, [image_uri]);

	// ✅ Default Stockholm coords
	const defaultCoords: [number, number] = [18.0686, 59.3293];

	// ✅ Set default coordinates in state
	const [mapCoords, setMapCoords] = useState<[number, number]>(defaultCoords);
	const [cameraKey, setCameraKey] = useState(0);

	const [posts, set_posts] = useState<Supply_post[]>([]);
	const [title, set_title] = useState("");
	const [description, set_description] = useState("");
	const [price, set_price] = useState("");
	const [category_type, set_category_type] = useState("Uthyrning");
	const [category, set_category] = useState("");
	const [location, set_location] = useState(`${defaultCoords[0]},${defaultCoords[1]}`); 
	const [post_picture_url, set_post_picture_url] = useState("");
	const [locationSearch, setLocationSearch] = useState("");

	const [title_error, set_title_error] = useState("");
	const [desc_error, set_desc_error] = useState("");
	const [price_error, set_price_error] = useState("");
	const [location_error, set_location_error] = useState("");

	

	useEffect(() => {
		// console.log("Params received in CreateAd:", params);
		if (params.image_uri) set_post_picture_url(params.image_uri as string);
		if (params.title) set_title(params.title as string);
		if (params.description) set_description(params.description as string);
		if (params.price) set_price(params.price as string);
		if (params.category_type) set_category_type(params.category_type as string);
		if (params.category) set_category(params.category as string);
		if (params.location) set_location(params.location as string);
	}, [params]);

	const categories_product = {
		ÖVRIGT: "Övrigt",
		HUSHÅLLSARTIKLAR: "hushållsartiklar",
		VERKTYG: "verktyg",
		ELEKTRONIK: "elektronik",
		MÖBLER: "möbler",
		KLÄDER: "kläder",
		SPORT_FRITID: "sport och fritid",
		BILAR_MOTORCYKLAR: "bilar och motorcyklar"
	};

	const categories_service = {
		ÖVRIGT: "Övrigt",
		TRÄDGÅRDSARBETE: "Trädgårdsarbete",
		HEMSTÄDNING: "Hemstädning",
		ÄRENDEHANTERING: "Ärendehantering",
		TRANSPORT: "Transport",
		HEMREPARATIONER: "Hemreparationer",
		TEKNIKHJÄLP: "Teknikhjälp"
	};

	const get_categories = () => {
		return category_type === "Uthyrning"
			? Object.entries(categories_product)
			: Object.entries(categories_service);
	};

	function validate_post(): boolean {
		set_title_error("");
		set_desc_error("");
		set_price_error("");
		set_location_error("");

		if (title.length <= 0) set_title_error("Titel måste anges");
		if (description.length <= 0) set_desc_error("Beskrivning måste anges");
		if (price.length <= 0) set_price_error("Pris måste anges");
		if (location.length <= 0) set_location_error("Plats måste anges");

		return title.length > 0 && description.length > 0 && price.length > 0 && category.length > 0 && location.length > 0;
	}

	function handleLocationSearch() {
		if (!locationSearch.trim()) return;
		const MAPBOX_TOKEN = "pk.eyJ1Ijoicm9zbzQ3ODUiLCJhIjoiY205dnRmb21tMGx0MzJpc20xaTBqZ2s5MCJ9.2vZamz2nGj3EQgNRqTC4aA";
		const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(locationSearch)}.json?access_token=${MAPBOX_TOKEN}&limit=1&country=SE`;
		axios.get(url)
			.then(res => {
				const features = res.data.features;
				if (features && features.length > 0) {
					const [lng, lat] = features[0].center;
					setMapCoords([lng, lat]);
					set_location(`${lng},${lat}`);
					setCameraKey(prev => prev + 1);
					set_location_error("");
				} else {
					set_location_error("Plats hittades inte");
				}
			})
			.catch(() => {
				set_location_error("Fel vid sökning av plats");
			});
	}

	async function send_supply_post() {
		try {
			const created_at = new Date().toLocaleDateString("sv-SE");
			const owner_id = await get_user_id();
			const owner_name = await get_user_name();
			if (!owner_id || !owner_name) throw new Error("User not authenticated");

			const newPost = new Supply_post(owner_id, owner_name, title, description, price, category, category_type, location, post_picture_url, created_at);
			await axios.post(`${SERVER_URL}/new_supply_post`, newPost, { headers: { auth: `${owner_id}` } }); 

			const response = await axios.get(`${SERVER_URL}/fetch_all_supply_posts`);
			set_posts(response.data);
			router.push("/(tabs)/(user_profile)");
		} catch (error: any) {
			console.error("new_supply_post failed:", error.message);
		}
	}

	const handle_new_supply_post = async () => {
		if (validate_post()) {
			await send_supply_post();
		}
	};

	const handle_add_images = () => {
  		router.push({
   			pathname: "./camera",
    		params: {
      			title,
      			description,
      			price,
      			category_type,
      			category,
      			location,
      			post_picture_url,
    		},
  		});
	};

	return (
		<ScrollView>
			<View style={styles.container}>
				<Text style={styles.title}>Skapa en annons</Text>

				<Text style={styles.label}>Titel</Text>
				<TextInput style={styles.input} value={title} onChangeText={set_title} placeholder="Ange en titel" />
				{title_error ? <Text style={styles.errorText}>{title_error}</Text> : null}

			<Text style={styles.label}>Uthyrning eller tjänst</Text>
			
			<View style={styles.pickerContainer}>
				<Picker
					selectedValue={category_type}
					style={styles.picker}
					onValueChange={(itemValue) => set_category_type(itemValue)}>
					<Picker.Item label="Uthyrning" value="Uthyrning" /> 
					<Picker.Item label="Tjänst" value="Tjänst" />
				</Picker>
			</View>

				<Text style={styles.label}>Kategori</Text>
				<View style={styles.pickerContainer}>
					<Picker selectedValue={category} style={styles.picker} onValueChange={set_category}>
						{get_categories().map(([key, label]) => (
							<Picker.Item key={key} label={label} value={label} />
						))}
					</Picker>
				</View>

                <Text style={styles.label}>Beskrivning</Text>
                <TextInput
                    style={styles.textarea}
                    value={description}
                    onChangeText={set_description}
                    placeholder="Beskriv din annons"
                    multiline
                />
                {desc_error ? <Text style={styles.errorText}>{desc_error}</Text> : null}

				<Text style={styles.label}>Pris</Text>
				<TextInput
					style={styles.input}
					value={price}
					placeholder="Ange ett pris"
					keyboardType="numeric"
					onChangeText={(text) => set_price(text.replace(/[^0-9]/g, ''))}
				/>
				{price_error ? <Text style={styles.errorText}>{price_error}</Text> : null}
				
				<TouchableOpacity style={styles.imagePreviewContainer} onPress={handle_add_images}>
                    {post_picture_url ? (
                        <Image
                            source={{ uri: post_picture_url }}
                            style={styles.imagePreview}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>Ladda upp bild</Text>
                        </View>
                    )}
                </TouchableOpacity>

				<Text style={styles.label}>Plats</Text>

				<View>
					<TextInput
						style={styles.input}
						value={locationSearch}
						onChangeText={setLocationSearch}
						placeholder="Sök efter plats..."
						onSubmitEditing={handleLocationSearch}
					/>
					<TouchableOpacity onPress={handleLocationSearch}>
						<Text>Sök</Text>
					</TouchableOpacity>
				</View>
				{location_error ? <Text style={styles.errorText}>{location_error}</Text> : null}

				<View style={{ width: "100%", height: 250, marginBottom: 20 }}>
					<MapView style={{ flex: 1 }} onPress={(e) => {
						const coords = e.geometry.coordinates;
						setMapCoords([coords[0], coords[1]]);
						set_location(`${coords[0]},${coords[1]}`);
					}}>
						<Camera
							key={cameraKey}
							centerCoordinate={mapCoords}
							zoomLevel={13}
							animationMode="flyTo"
							animationDuration={1000}
						/>
						<MarkerView coordinate={mapCoords}>
							<View style={{ backgroundColor: "blue", padding: 4, borderRadius: 4 }}>
								<Text style={{ color: "white", fontSize: 10 }}>Vald plats</Text>
							</View>
						</MarkerView>
					</MapView>
				</View>

				<TouchableOpacity style={styles.createButton} onPress={handle_new_supply_post}>
					<Text style={styles.createButtonText}>Skapa Annons</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: "center" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
    input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, textAlign: "left" },
    dropdown: { height: 50, width: "100%", marginBottom: 10 },
    textarea: { height: 100, borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5, textAlign: "left", textAlignVertical: "top" },
    imageContainer: { alignItems: "center", marginVertical: 20 },
    placeholderImage: { width: 150, height: 150, borderRadius: 10, opacity: 0.5 },
    uploadText: { marginTop: 10, fontSize: 16, fontWeight: "bold" },
    createButton: { backgroundColor: "#007AFF", paddingVertical: 8, borderRadius: 6, alignItems: "center", marginTop: 10 },
    createButtonText: { color: "#FFF", fontWeight: "bold" },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#999",
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "",
    },
    picker: {
        width: "100%",
        borderWidth: 0,
        backgroundColor: "transparent",
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 5,
        fontStyle: "italic",
    },
    imagePreviewContainer: {
        alignItems: "center",
        marginVertical: 10,
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
    },imagePlaceholder: {
        width: 200,
        height: 200,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "#888",
        fontStyle: "italic",
    },
});
