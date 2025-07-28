import { createAsyncThunk } from "@reduxjs/toolkit";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import axiosErrorHandler from "@util/axiosErrorHandler"; // لو بتستخدم نفس نظام الخطأ

type TFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};

const actAuthRegister = createAsyncThunk(
    "auth/actAuthRegister",
    async (formData: TFormData, thunk) => {
        const { rejectWithValue } = thunk;

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            const user = userCredential.user;

            await setDoc(doc(firestore, "users", user.uid), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                isAdmin: false,
                createdAt: serverTimestamp(),
            });

            return {
                user: {
                    id: user.uid,
                    email: user.email || "",
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    isAdmin: false,
                },
                accessToken: await user.getIdToken(),
            };
        } catch (error) {
            return rejectWithValue(axiosErrorHandler(error));
        }
    }
);

export default actAuthRegister;


// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axiosErrorHandler from "@util/axiosErrorHandler";
// import axios from "axios";

// type TFormData = {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
// };

// const actAuthRegister = createAsyncThunk(
//     "auth/actAuthRegister",
//     async (formData: TFormData, thunk) => {
//         const { rejectWithValue } = thunk;

//         try {
//             const res = await axios.post("/register", formData);
//             return res.data;
//         } catch (error) {
//             return rejectWithValue(axiosErrorHandler(error));
//         }
//     }
// );

// export default actAuthRegister;