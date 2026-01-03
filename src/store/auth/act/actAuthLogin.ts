import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";
// import axiosErrorHandler from "@util/axiosErrorHandler";
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
            // معالجة أخطاء Firebase
            if (error instanceof FirebaseError) {
                const errorMessage = getFirebaseErrorMessage(error.code);
                return rejectWithValue(errorMessage);
            }

            // معالجة الأخطاء الأخرى
            return rejectWithValue("حدث خطأ غير متوقع");
        }
    }
);

// دالة لترجمة أكواد أخطاء Firebase إلى رسائل واضحة
const getFirebaseErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case "auth/invalid-email":
            return "البريد الإلكتروني غير صحيح";
        case "auth/user-disabled":
            return "هذا الحساب معطل";
        case "auth/user-not-found":
            return "البريد الإلكتروني غير مسجل";
        case "auth/wrong-password":
            return "كلمة المرور غير صحيحة";
        case "auth/invalid-credential":
            return "بيانات الدخول غير صحيحة";
        case "auth/too-many-requests":
            return "محاولات كثيرة جداً، حاول لاحقاً";
        case "auth/network-request-failed":
            return "خطأ في الاتصال بالإنترنت";
        default:
            return "حدث خطأ أثناء تسجيل الدخول";
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
