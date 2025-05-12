import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { get_user_id } from "@/auth_token";
import axios from "axios";
import { Supply_post, User } from "@/classes_tmp";

export default function UserProfilePage() {
  const SERVER_URL = "http://localhost:3000";

  const empty_user = new User("", "", "", "", "", "", "", "", "");
  const [user, setUser] = useState<User>(empty_user);
  const [posts, setPosts] = useState<Supply_post[]>([]);

  async function fetchUser() {
    try {
      const response = await axios.get(`${SERVER_URL}/fetch_user`, { headers: { auth: `${await get_user_id()}` } });
      setUser(response.data);
    } catch (error: any) {
      console.error("Failed to fetch user info:", error.message);
    }
  }

  async function fetchMySupplyPosts() {
    try {
      const response = await axios.get(`${SERVER_URL}/fetch_my_supply_posts`, { headers: { auth: `${await get_user_id()}` } });
      setPosts(response.data);
    } catch (error: any) {
      console.error("Failed to fetch supply posts:", error.message);
    }
  }

	async function edit_profile() {
/* 		try {
			const user = {
				name: name,
				password: password
			}
			const response = await axios.post(`${SERVER_URL}/login`, user);
			await save_user_id(response.data);
			
			console.log(`Retrieved user id: "${response.data}"`);

			// Sends the client to the marketplace page
			router.push("/(tabs)/(marketplace)");
		} catch (error: any) {
			console.error("Login failed:", error.message);
			set_error_message("Inloggning misslyckades. Försök igen.");
		} */
	}

	// Handles a clients login when the login button is pressed
	const handle_edit_profile = async () => {
		await edit_profile();
	};

  useEffect(() => {
    fetchUser();
    fetchMySupplyPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          <Image 
            source={{ uri: `https://api.dicebear.com/7.x/micah/svg?seed=${user.name}` }} 
            style={styles.profileImage} 
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userBio}>{user.bio}</Text>
            <Text style={styles.userDetails}>{user.phone_number}</Text>
            <Text style={styles.userDetails}>{user.mail}</Text>
            <Text style={styles.userDetails}>{user.address}</Text>
            <Text style={styles.userDetails}>{user.date_of_birth}</Text>
          </View>
        </View>
            <TouchableOpacity style={styles.button} onPress={handle_edit_profile}>
              <Text style={styles.buttonText}>Redigera profil</Text>
            </TouchableOpacity>
      </View>

      {/* Posts Section Wrapped in Light Gray Container */}
      <View style={styles.postsWrapper}>
        <ScrollView style={styles.postsContainer}>
          {posts.map((post, index) => (
            <View style={styles.post} key={index}>
              <Text style={styles.postTitle}>{post.title}</Text>
              <Text style={styles.postDescription}>{post.description}</Text>
              <Text style={styles.postCategory}>{post.category}</Text>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    width: "90%",
  
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 40,
    marginRight: 30,
  },
  userInfo: {
    flexDirection: "column",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  userDetails: {
    fontSize: 16,
    color: "#888",
  },
  userBio: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#555",
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
  postTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  postDescription: {
    fontSize: 14,
    color: "#555",
  },
  postCategory: {
    fontSize: 14,
    fontStyle: "italic",
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
	button: {
		width: "100%",
		backgroundColor: "#007AFF",
		paddingVertical: 12,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 15,
	  },
	buttonText: {
		color: "#FFF",
		fontSize: 16,
		fontWeight: "bold",
	  },
});
