// // services/api.ts
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const API_URL = "http://192.168.15.19:8080";

// const api = axios.create({
//   baseURL: API_URL,
// });

// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("token");

//   if (token && config.headers) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;
