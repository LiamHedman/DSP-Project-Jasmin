import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router'; // <-- Import this hook

const PostScreen = () => {
  const { title, bio } = useLocalSearchParams(); // Extract params from URL

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{title || 'Inget namn'}</Text>

      {/* Image */}
      <Image
        source={{ uri: 'https://your-image-url.com' }}
        style={styles.image}
      />

      {/* User Info */}
      <View style={styles.userContainer}>
        <Image
          source={{ uri: 'https://your-user-image-url.com' }}
          style={styles.userImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Verktygaren</Text>
          <View style={styles.stars}>
            {[...Array(4)].map((_, i) => (
              <Ionicons key={i} name="star" size={18} color="#f1c40f" />
            ))}
            <Ionicons name="star-outline" size={18} color="#f1c40f" />
          </View>
        </View>
      </View>

      {/* Bio */}
      <Text style={styles.price}>
        <Text style={{ fontWeight: 'bold' }}>Beskrivning:</Text> {bio || 'Ingen beskrivning'}
      </Text>

      {/* Price */}
      <Text style={styles.price}>
        <Text style={{ fontWeight: 'bold' }}>Pris:</Text> 70 kr / dag
      </Text>
    </View>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#DFFFD6',
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  stars: {
    flexDirection: 'row',
    marginTop: 4,
  },
  price: {
    fontSize: 18,
    marginVertical: 12,
  },
});