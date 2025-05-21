import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { get_user_id } from "@/auth_token";
import axios from "axios";
import { User } from "@/classes_tmp";
import { router } from "expo-router";

export default function UserProfilePage() {
    const SERVER_URL = "http://localhost:3000";
    const [user, set_user] = useState<User | null>(null); // Start as null
    const [loading, set_loading] = useState(true); // Track loading state

    // User info
    const [name, set_name] = useState("");
    const [bio, set_bio] = useState("");
    const [mail, set_mail] = useState("");
    const [phone_number, set_phone_number] = useState("");
    const [address, set_address] = useState("");
    const [date_of_birth, set_date_of_birth] = useState("");

    // Error texts
    const [mail_error, set_mail_error] = useState("");
    const [name_error, set_name_error] = useState("");
    const [phone_number_error, set_phone_number_error] = useState("");
    const [bio_error, set_bio_error] = useState("");
    const [address_error, set_address_error] = useState("");
    const [date_of_birth_error, set_date_of_birth_error] = useState("");

    const validate_mail = (text: string) => {
        set_mail(text);

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
            set_mail_error("Ogiltig e-postadress. Kontrollera formatet.");
        } else {
            set_mail_error("");
        }
    }

    const validate_name = (name: string) => {
        set_name(name);

        if (!(name.trim().length >= 2)) {
            set_name_error("Ogiltigt användarnamn. Måste bestå av minst 2 tecken")
        } else {
            set_name_error("");
        }
    }

    const validate_phone_number = (text: string) => {
        set_phone_number(text);
        const phoneRegex = /^[0-9+\-()\s]{7,20}$/;
        if (!phoneRegex.test(text)) {
            set_phone_number_error("Ogiltigt telefonnummer.");
        } else {
            set_phone_number_error("");
        }
    };

    const validate_bio = (text: string) => {
        set_bio(text);
        if (text.length > 200) {
            set_bio_error("Biografin får max vara 200 tecken.");
        } else {
            set_bio_error("");
        }
    };

    const validate_address = (text: string) => {
        set_address(text);
        if (text.trim().length < 5) {
            set_address_error("Adressen måste vara minst 5 tecken.");
        } else {
            set_address_error("");
        }
    };

    const validate_date_of_birth = (text: string) => {
        set_date_of_birth(text);
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // yyyy-mm-dd
        if (!dateRegex.test(text)) {
            set_date_of_birth_error("Ogiltigt datumformat. Använd YYYY-MM-DD.");
        } else {
            set_date_of_birth_error("");
        }
    };

    function validate_edit(): boolean {
        return bio_error.length === 0 &&
            mail_error.length === 0 &&
            name_error.length === 0 &&
            address_error.length === 0 &&
            date_of_birth_error.length === 0 &&
            phone_number_error.length === 0 &&
            name.length != 0 &&
            mail.length != 0;
    }

    async function fetch_user() {
        try {
            const response = await axios.get(`${SERVER_URL}/fetch_user`, { headers: { auth: `${await get_user_id()}` } });
            const fetched_user = response.data;

            set_user(fetched_user);
            set_loading(false);

            set_name(fetched_user?.name || "Unnamed User");
            set_bio(fetched_user?.bio || "");
            set_mail(fetched_user?.mail || "");
            set_phone_number(fetched_user?.phone_number || "");
            set_address(fetched_user?.address || "");
            set_date_of_birth(fetched_user?.date_of_birth || "");
        } catch (error: any) {
            console.error("Failed to fetch user info:", error.message);
            set_loading(false);
        }
    }

    async function edit_profile() {
        try {
            console.log("edit user");
            //TODO: need to verify user inputs
            const new_user_info = { name, mail, phone_number, bio, address, date_of_birth, profile_picture_url: "" };
            const response = await axios.post(`${SERVER_URL}/modify_user`, new_user_info, { headers: { auth: `${await get_user_id()}` } });
            set_user(response.data);

            router.push("/(tabs)/(user_profile)");
        } catch (error: any) {
            console.error("Edit profile failed:", error.message);
        }
    }

    const handle_edit_profile = async () => {
        if (validate_edit()) {
            await edit_profile();
        }
    };

    useEffect(() => {
        fetch_user();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.profilePicture}>
                    <Image
                        source={{ uri: loading ? "https://via.placeholder.com/100x100/FFFFFF/FFFFFF" : `https://api.dicebear.com/7.x/micah/svg?seed=${user?.id}` }}
                        style={styles.profileImage}
                    />
                </View>

                <View style={styles.userInfo}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Namn</Text>
                        <TextInput style={styles.input} value={name} onChangeText={validate_name} placeholder="Ange ditt namn" />
                        {name_error ? <Text style={styles.errorText}>{name_error}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Biografi</Text>
                        <TextInput style={styles.input} value={bio} onChangeText={validate_bio} placeholder="Ange din biografi" />
                        {bio_error ? <Text style={styles.errorText}>{bio_error}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Telefonnummer</Text>
                        <TextInput style={styles.input} value={phone_number} onChangeText={validate_phone_number} placeholder="Ange ditt telefonnummer" />
                        {phone_number_error ? <Text style={styles.errorText}>{phone_number_error}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>E-post</Text>
                        <TextInput style={styles.input} value={mail} onChangeText={validate_mail} placeholder="Ange din e-postadress" />
                        {mail_error ? <Text style={styles.errorText}>{mail_error}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Adress</Text>
                        <TextInput style={styles.input} value={address} onChangeText={validate_address} placeholder="Ange din adress" />
                        {address_error ? <Text style={styles.errorText}>{address_error}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.inputTitle}>Födelsedatum</Text>
                        <TextInput style={styles.input} value={date_of_birth} onChangeText={validate_date_of_birth} placeholder="Ange ditt födelsedatum" />
                        {date_of_birth_error ? <Text style={styles.errorText}>{date_of_birth_error}</Text> : null}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handle_edit_profile}>
                        <Text style={styles.buttonText}>Spara ändringar</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F8F8", alignItems: "center" },
    profileContainer: { alignItems: "center", backgroundColor: "#FFF", paddingTop: 50, paddingBottom: 50, borderRadius: 15, marginTop: 20, width: "90%" },
    profilePicture: { marginBottom: 50, flexDirection: "row", alignItems: "center" },
    profileImage: { width: 150, height: 150, borderRadius: 80 },
    userInfo: { flexDirection: "column", width: "100%", alignItems: "center" },
    userName: { fontSize: 22, fontWeight: "bold" },
    userDetails: { fontSize: 16, color: "#888" },
    userBio: { fontSize: 14, fontStyle: "italic", color: "#555" },
    inputContainer: { width: "80%" },
    inputTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#444",
        marginBottom: 4,
    },
    input: {
        width: "100%",
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: "#CCC",
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        width: "80%",
        backgroundColor: '#007AFF',
        paddingVertical: 6,
        borderRadius: 5,
        elevation: 5,
        alignItems: 'center',
        margin: 5,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 14,
    },
    errorText: {
        color: "red",
        fontSize: 14,
        marginTop: 5,
        fontStyle: "italic",
    },
});
