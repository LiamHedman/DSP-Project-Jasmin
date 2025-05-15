import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function CreateAd() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");

    const handle_create_supply_post = async () => { };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Skapa en annons</Text>

            <Text style={styles.label}>Titel</Text>
            <TextInput 
                style={styles.input} 
                value={title} 
                onChangeText={setTitle} 
                placeholder="Ange en titel"
            />

            <Text style={styles.label}>Kategori</Text>
            <Picker
                selectedValue={category}
                style={styles.dropdown}
                onValueChange={(itemValue: React.SetStateAction<string>) => setCategory(itemValue)}
            >
                <Picker.Item label="Hushållsartiklar" value="household" />
                <Picker.Item label="Verktyg" value="tools" />
                <Picker.Item label="Elektronik" value="electronics" />
                <Picker.Item label="Möbler" value="furniture" />
                <Picker.Item label="Kläder" value="clothing" />
                <Picker.Item label="Sport & Fritid" value="sports" />
                <Picker.Item label="Bilar & Motorcyklar" value="vehicles" />
            </Picker>

            <Text style={styles.label}>Beskrivning</Text>
            <TextInput 
                style={styles.textarea} 
                value={description} 
                onChangeText={setDescription} 
                placeholder="Beskriv din annons"
                multiline
            />

            <Text style={styles.label}>Pris</Text>
            <TextInput 
                style={styles.input} 
                value={price} 
                onChangeText={setPrice} 
                placeholder="Ange ett pris"
                keyboardType="numeric"
            />

            <View style={styles.imageContainer}>
                <Image style={styles.placeholderImage} source={{ uri: "https://via.placeholder.com/150" }} />
                <Text style={styles.uploadText}>Ladda upp bilder</Text>
            </View>

            <TouchableOpacity style={styles.createButton} onPress={handle_create_supply_post}>
                <Text style={styles.createButtonText}>Skapa Annons</Text>
            </TouchableOpacity>
        </View>
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
    placeholderImage: { width: 150, height: 150, borderRadius: 10 },
    uploadText: { marginTop: 10, fontSize: 16, fontWeight: "bold" },
    createButton: { backgroundColor: "#007AFF", paddingVertical: 8, borderRadius: 6, alignItems: "center", marginTop: 10 },
    createButtonText: { color: "#FFF", fontWeight: "bold" },
});
