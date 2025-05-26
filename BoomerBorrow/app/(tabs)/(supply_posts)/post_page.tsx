import { Supply_post, User } from "@/classes_tmp";
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Button, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { button as customButton } from "@/assets/ui_elements/buttons";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <ScrollView>
            <SafeAreaView>
                <View style={containers.container}>
                    <View style={containers.img_container}>
                        <Image
                            source={{ uri: post?.post_picture_url }}
                            style={styles.productImage}
                        />
                    </View>
                    <View style={containers.main_container}>
                        <View style={containers.post_container}>
                            <View style={containers.pi_1_container}>
                                <Text style={styles.title}>{post?.title}</Text>
                                <Text style={styles.price}>Pris: {post?.price} SEK</Text>
                                <Text style={styles.description}>{post?.description}</Text>
                            </View>
                            {/* Post details */}
                            <View style={containers.pi_2_container}>
                                <Text style={styles.info}><Text style={{ fontWeight: "bold" }}>Uthyrning/tjänst:</Text> {post?.category_type.toLowerCase()}</Text>
                                <Text style={styles.info}><Text style={{ fontWeight: "bold" }}>Kategori:</Text> {post?.category}</Text>
                                <Text style={styles.info}><Text style={{ fontWeight: 'bold' }}>Plats:</Text> {post?.location}</Text>
                            </View>

                        </View>
                        {/* Post pic*/}

                        {/* Selles info */}
                        <View style={containers.owner_container}>
                            <Text style={styles.price}>Ägarens uppgifter:</Text>

                            {/* Row container with image and text side by side */}
                            <View style={styles.ownerRow}>
                                <Image
                                    source={{ uri: `https://api.dicebear.com/7.x/micah/svg?seed=${owner?.id}` }}
                                    style={styles.ownerImage}
                                />

                                <View style={styles.ownerTextContainer}>
                                    <Text style={styles.info}><Text style={{ fontWeight: 'bold' }}>Namn:</Text> {owner?.name}</Text>
                                    <Text style={styles.info}><Text style={{ fontWeight: 'bold' }}>Email:</Text> {owner?.mail}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={containers.conversation_container}>
                            {customButton({
                                title: "Starta en konversation",
                                on_press: () => router.push({
                                    pathname: "/(tabs)/(chat)/ChatListScreen",
                                    params: {
                                        owner_id: owner_id,
                                        owner_name: owner_name,
                                    },
                                }),
                                variant: "visit",
                                bottom_margin: 20,
                            })}
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
};

const containers = StyleSheet.create({
    container: {
        width: "100%",
        backgroundColor: "#ffffff",
    },
    main_container: {
        width: "100%",
        padding: 20,
    },
    img_container: {
        alignContent: "center",
        alignItems: "center",
        paddingBottom: 20,
        marginBottom: -15,
        backgroundColor: "#ededed",
    },
    post_container: {
        alignContent: "center",
        marginBottom: 20,
    },
    owner_container: {
        alignContent: "center",
        marginBottom: 20,
    },
    pi_1_container: {
        alignContent: "center",
        marginBottom: 20,
    },
    pi_2_container: {
        alignContent: "center",
        padding: 20,
        backgroundColor: "#ededed",
        borderRadius: 20,
    },
    conversation_container: {
        alignContent: "center",
        alignItems: "center",
    },
});

const styles = StyleSheet.create({
    ownerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    ownerImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    ownerTextContainer: {
        flexDirection: "column",
        flex: 1,
    },
    productImage: {
        width: 250,
        height: 250,
        borderRadius: 10,
    },
    postIcon: {
        width: 150,
        height: 150,
        marginRight: 15,
        borderRadius: 25,
    },
    title: {
        fontSize: 40,
        fontWeight: "bold",
        marginBottom: 0,
    },
    price: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 5,
    },
    description: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 10, 
    },
    info: {
        fontSize: 18,
        marginBottom: 5,
    },
});

export default MarketplaceProduct;
