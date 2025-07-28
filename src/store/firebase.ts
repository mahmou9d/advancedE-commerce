import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ من Firebase SDK

const firebaseConfig = {
    apiKey: "AIzaSyA7KBMO8JKpRLSbDLLQF5ja6FLU0FOR2_g",
    authDomain: "ecomerce-9281d.firebaseapp.com",
    projectId: "ecomerce-9281d",
    storageBucket: "ecomerce-9281d.appspot.com",
    messagingSenderId: "1035327447717",
    appId: "1:1035327447717:web:23018256a4971a684da34c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app); // ✅ هذا هو التخزين الصحيح
