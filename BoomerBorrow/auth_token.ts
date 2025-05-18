import AsyncStorage from '@react-native-async-storage/async-storage';

export async function save_user_id(user_id: string) {
  console.log("User id updated: ", user_id);
  await AsyncStorage.setItem("user_id", user_id);
}

export async function get_user_id() {
  return await AsyncStorage.getItem("user_id");
}
