import AsyncStorage from '@react-native-async-storage/async-storage';

export async function save_user_id(user_id: string) {
  await AsyncStorage.setItem("user_id", user_id);
}

export async function get_user_id() {
  return await AsyncStorage.getItem("user_id");
}

export async function save_user_name(user_name: string) {
  await AsyncStorage.setItem("user_name", user_name);
}

export async function get_user_name() {
  return await AsyncStorage.getItem("user_name");
}