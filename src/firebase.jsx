import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyAGGYEmbfvdsC5_xXMAbC8GMscJcQV32ow",

  authDomain: "task-flagger.firebaseapp.com",

  projectId: "task-flagger",

  storageBucket: "task-flagger.firebasestorage.app",

  messagingSenderId: "707622000958",

  appId: "1:707622000958:web:cc97fea527f03b3133b46f",

  measurementId: "G-PXRG7DQYYH"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
export const googleProvider = new GoogleAuthProvider();