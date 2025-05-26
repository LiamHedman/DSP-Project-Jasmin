import { Supply_post, User } from "@/classes_tmp";
import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";

const MarketplaceProduct = () => {
    const SERVER_URL = "http://localhost:3000";

    const [post, set_post] = useState<Supply_post>();
    const [owner, set_owner] = useState<User | null>(null); // Start as null
    const { post_id, owner_id, owner_name } = useLocalSearchParams<{ post_id: string; owner_id: string; owner_name: string; }>();

    async function fetch_supply_post() {
        try {
            if (!post_id) return;
            const response = await axios.get(`${SERVER_URL}/fetch_supply_post`, { headers: { auth: post_id } });
            set_post(response.data);
        } catch (error: any) {
            console.error("Failed to fetch supply_post:", error.message);
        }
    }

    async function fetch_user() {
        try {
            const response = await axios.get(`${SERVER_URL}/fetch_user`, { headers: { auth: `${post?.owner_id}` } });
            const fetched_user = response.data;
            set_owner(fetched_user);
        } catch (error: any) {
            console.error("Failed to fetch owner info:", error.message);
        }
    }

    useEffect(() => {
        if (post_id) {
            fetch_supply_post();
        }
    }, [post_id]);

    useEffect(() => {
        if (post && post.owner_id) {
            fetch_user();
        }
    }, [post?.owner_id]);

    return (
        <View style={styles.container}>
            {/* Post pic*/}
            <Image
                source={{ uri: post?.post_picture_url }}
                style={styles.productImage} />

            {/* Post details */}
            <Text style={styles.title}>{post?.title}</Text>
            <Text style={styles.description}>{post?.description}</Text>
            <Text style={styles.info}>Price: {post?.price} SEK</Text>
            <Text style={styles.info}>Category Type: {post?.category_type}</Text>
            <Text style={styles.info}>Category: {post?.category}</Text>
            <Text style={styles.info}>Location: {post?.location}</Text>

            <Text style={styles.info}>Owner's Name: {post?.owner_name}</Text>

            <Button 
                title="till chat"
                onPress={() => router.push({
                                    pathname: "/(tabs)/(chat)/ChatListScreen",
                                    params: {
                                        owner_id: owner_id,
                                        owner_name: owner_name,
                                    },
                    })
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    productImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        marginBottom: 10,
    },
    info: {
        fontSize: 18,
        marginBottom: 5,
    },
});

export default MarketplaceProduct;
