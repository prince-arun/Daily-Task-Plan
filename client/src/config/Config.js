import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlfQJbArRchvbZA4CWUk_h1PUf4vAFdX4",
  authDomain: "daily-planner-c3199.firebaseapp.com",
  projectId: "daily-planner-c3199",
  storageBucket: "daily-planner-c3199.appspot.com",
  messagingSenderId: "790149349160",
  appId: "1:790149349160:web:d60316d4d6e4c29e231a1d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
