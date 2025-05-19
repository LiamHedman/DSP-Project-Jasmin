import React, { useEffect, useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Supply_post } from "@/classes_tmp";
import { get_user_id, get_user_name } from "@/auth_token";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";

export default function CreateAd() {
    const SERVER_URL = "http://localhost:3000";
    let supply_post: Supply_post;

    // camera things
    const { image_uri } = useLocalSearchParams();

    useEffect(() => {
        if (image_uri && typeof image_uri === "string") {
            set_post_picture_url(image_uri);
        }
    }, [image_uri]);

    // Post info
    const [posts, set_posts] = useState<Supply_post[]>([]);
    const [title, set_title] = useState("");
    const [description, set_description] = useState("");
    const [price, set_price] = useState("");
    const [category_type, set_category_type] = useState("Produkt");
    const [category, set_category] = useState("");
    const [location, set_location] = useState("");
    const [post_picture_url, set_post_picture_url] = useState("");

    // Error texts
    const [title_error, set_title_error] = useState("");
    const [desc_error, set_desc_error] = useState("");
    const [price_error, set_price_error] = useState("");

    // Categories for the different posts
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

    function validate_post(): boolean {
        set_title_error("");
        set_desc_error("");
        set_price_error("");

        if (title.length <= 0) {
            set_title_error("Titel måste anges");
        } else if (description.length <= 0) {
            set_desc_error("Beskrivning måste anges");
        } else if (price.length <= 0) {
            set_price_error("Pris måste anges");
        }

        return title.length != 0 &&
            description.length != 0 &&
            price.length != 0 &&
            category.length != 0 &&
            category_type.length != 0;
    };

    const get_categories = () => {
        return category_type === "Produkt"
            ? Object.entries(categories_product)
            : Object.entries(categories_service);
    };

    async function send_supply_post() {
        console.log("HEJ");
        try {
            const created_at = new Date().toLocaleDateString("sv-SE");
            const owner_id = await get_user_id();
            const owner_name = await get_user_name();

            if (owner_id === null || owner_name === null ) { throw new Error("Owner id or name cannot be null upon post creation"); }
            supply_post = new Supply_post(owner_id, owner_name, title, description, price, category, category_type, location, post_picture_url, created_at);

            await axios.post(`${SERVER_URL}/new_supply_post`, supply_post, { headers: { auth: `${await get_user_id()}` } });
            console.log("post_data (the new post) sent to the server");

            const response = await axios.get(`${SERVER_URL}/fetch_all_supply_posts`);
            set_posts(response.data);
            router.back();
        } catch (error: any) {
            console.error("new_supply_post failed:", error.message);
        }
    }
    const handle_new_supply_post = async () => {
        if (validate_post()) {
            await send_supply_post();
            router.push("/(tabs)/(user_profile)/user_profile_page");
        }
    };

    // Mock function, do not remove
    const handle_add_images = async () => {
        router.push("./camera");
    };

    return (
        <ScrollView>

            <View style={styles.container}>
                {/* Inputs for post creation */}
                <Text style={styles.title}>Skapa en annons</Text>

                <Text style={styles.label}>Titel</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={set_title}
                    placeholder="Ange en titel"
                />
                {title_error ? <Text style={styles.errorText}>{title_error}</Text> : null}

                <Text style={styles.label}>Produkt eller tjänst</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={category_type}
                        style={styles.picker}
                        onValueChange={(itemValue) => set_category_type(itemValue)}>
                        <Picker.Item label="Produkt" value="Produkt" />
                        <Picker.Item label="Tjänst" value="Tjänst" />
                    </Picker>
                </View>

                <Text style={styles.label}>Kategori</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={category}
                        style={styles.picker}
                        onValueChange={(itemValue) => set_category(itemValue)}>
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
                
                {/* Action buttons for the post creation */}
                <TouchableOpacity style={styles.createButton} onPress={handle_add_images}>
                    <Text style={styles.createButtonText}>Ladda upp bilder</Text>
                </TouchableOpacity>
                <View style={styles.imagePreviewContainer}>
                    {post_picture_url ? (
                        <Image
                            source={{ uri: post_picture_url }}
                            style={styles.imagePreview}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderText}>Ingen bild vald</Text>
                        </View>
                    )}
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
