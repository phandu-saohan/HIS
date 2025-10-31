import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBXeIbkjBwRgV39sTz8VfY5Qr-xhLt-NoU",
  authDomain: "his-test-e691f.firebaseapp.com",
  projectId: "his-test-e691f",
  storageBucket: "his-test-e691f.firebasestorage.app",
  messagingSenderId: "540118439621",
  appId: "1:540118439621:web:eb5838739f25b17ede02ac",
  measurementId: "G-FK5GSZBWHQ",
  databaseURL: "https://his-test-e691f-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Khởi tạo các dịch vụ Firebase
export const db = getDatabase(app);
export const auth = getAuth(app);