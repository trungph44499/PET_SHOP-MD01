// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBQDkxQ1MmWITWP_S-Dk8QQSCyUgfWggKY",
  authDomain: "pet-shop-md01.firebaseapp.com",
  projectId: "pet-shop-md01",
  storageBucket: "pet-shop-md01.appspot.com",
  messagingSenderId: "708432650322",
  appId: "1:708432650322:web:7fb272560d52ca941aff8b",
  measurementId: "G-TKCTX0Z9V9"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Auth với AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { auth };