import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from "react-native";
import axios from "axios";

type Post = {
    type: string,
    data: {
        title: string,
        bio: string
    }
};

export default function MarketplaceScreen() {
    const SERVER_URL = "http://localhost:3000";

	// use set_title() etc. if you want to update the username or password 
    const [title, set_title] = useState("");
    const [bio, set_bio] = useState("");
    const [posts, set_posts] = useState<Post[]>([]);

    const post_data = {
        "type": "new_post",
        "data": {
            "title": title,
            "bio": bio
        }
    };

    useEffect(() => {
        // Fetches all the posts upon mount (page load)
        async function fetch_posts() {
            try {
                const response = await axios.get(`${SERVER_URL}/fetch_posts`);
                set_posts(response.data);
            } catch (error: any) {
                console.error("Failed to fetch posts:", error.message);
            }
        }
        
        fetch_posts();
    }, []);

    async function send_post() {
        try {
            // Sends the post to the server
            await axios.post(`${SERVER_URL}/new_post`, post_data);
            console.log("post_data (the new post) sent to the server");

            // Fetches updated posts list
            const response = await axios.get(`${SERVER_URL}/fetch_posts`);
            set_posts(response.data);
        } catch (error: any) {
            console.error("new_post failed:", error.message);
        }
    }
    
    const handle_new_post = async () => {
        await send_post();
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.posts_container}>
                <ScrollView>
                    {posts.map((post_data: Post) => {
                        return (
                            <View style={styles.post}>
                                <Text> {post_data.data?.title} </Text>
                                <Text> {post_data.data?.bio} </Text>
                            </View>
                        );
                    })}
                </ScrollView>
            </View>
    
            <TextInput
                style={styles.input}
                placeholder="Titel"
                value={title}
                onChangeText={set_title} // Updates state
            />
            <TextInput
                style={styles.input}
                placeholder="Beskrivning"
                value={bio}
                onChangeText={set_bio} // Updates state
            />
            <Button
                title="Skapa annons"
                onPress={ handle_new_post } 
            />
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "green"
    },
    input: {
        height: 40,
        width: "80%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "white"
    },
    post: {
        height: 80,
        width: "95%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "white",
        borderBlockColor: "black"
    },
    posts_container: {
        height: 300,
        width: "90%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "white"
    }
});