import AsyncStorage from '@react-native-async-storage/async-storage';

const token_storage = {
    async store_token(token: string) {
        try {
            await AsyncStorage.setItem("auth_token", token);
        } catch (error) {
            console.error("Error storing token:", error);
        }
    },

    async get_token() {
        try {
            const token = await AsyncStorage.getItem("auth_token");
            return token ? token : null;
        } catch (error) {
            console.error("Error retrieving token:", error);
            return null;
        }
    },

    async remove_token() {
        try {
            await AsyncStorage.removeItem("auth_token");
        } catch (error) {
            console.error("Error removing token:", error);
        }
    }
};

export default token_storage;
