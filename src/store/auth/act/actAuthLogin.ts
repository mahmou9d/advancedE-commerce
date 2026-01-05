import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";
import { FirebaseError } from "firebase/app";

type TFormData = {
    email: string;
    password: string;
};

const actAuthLogin = createAsyncThunk(
    "auth/actAuthLogin",
    async (formData: TFormData, thunk) => {
        const { rejectWithValue } = thunk;

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            const userDoc = await getDoc(doc(firestore, "users", user.uid));
            const userData = userDoc.data();
            console.log(userDoc,"userCredential")
            const isAdmin = user.email === "mohnud0987a@gmail.com";

            return {
                user: {
                    id: user.uid,
                    email: user.email || "",
                    firstName: userData?.firstName || "",
                    lastName: userData?.lastName || "",
                    isAdmin,
                },
                accessToken: await user.getIdToken(),
            };
        } catch (error) {
            if (error instanceof FirebaseError) {
                const errorMessage = getFirebaseErrorMessage(error.code);
                return rejectWithValue(errorMessage);
            }
            return rejectWithValue("حدث خطأ غير متوقع");
        }
    }
);

const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case "auth/invalid-email":
            return "Invalid email address";
        case "auth/user-disabled":
            return "This account has been disabled";
        case "auth/user-not-found":
            return "Email not registered";
        case "auth/wrong-password":
            return "Incorrect password";
        case "auth/invalid-credential":
            return "Invalid login credentials";
        case "auth/too-many-requests":
            return "Too many attempts, please try again later";
        case "auth/network-request-failed":
            return "Network connection error";
        default:
            return "An error occurred during login";
    }
};


export default actAuthLogin;

// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosErrorHandler from "@util/axiosErrorHandler";
// import axios from "axios";

// type TFormData = {
//     email: string;
//     password: string;
// };

// type TResponse = {
//     user: {
//         id: number;
//         email: string;
//         firstName: string;
//         lastName: string;
//     };
//     accessToken: string;
// };

// const actAuthLogin = createAsyncThunk(
//     "auth/actAuthLogin",
//     async (formData: TFormData, thunk) => {
//         const { rejectWithValue } = thunk;

//         try {
//             const res = await axios.post<TResponse>("/login", formData);
//             return res.data;
//         } catch (error) {
//             return rejectWithValue(axiosErrorHandler(error));
//         }
//     }
// );

// export default actAuthLogin;
