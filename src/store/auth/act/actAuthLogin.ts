import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";
import axiosErrorHandler from "@util/axiosErrorHandler";

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

            const isAdmin = user.email === "mohnud0987@gmail.com";

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
            return rejectWithValue(axiosErrorHandler(error));
        }
    }
);

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
