import axios from "axios";
import { useState } from "react";

type TStatus = "idle" | "checking" | "available" | "notAvailable" | "failed";

const useCheckEmailAvailability = () => {
    const [email, setEmail] = useState<string>(""); // حفظ البريد الإلكتروني المدخل
    const [emailAvailabilityStatus, setEmailAvailabilityStatus] = useState<TStatus>("idle");

    const checkEmailAvailability = async (email: string) => {
        setEmail(email); // تحديث البريد الإلكتروني المدخل
        setEmailAvailabilityStatus("checking");
        try {
            const response = await axios.get(`/users?email=${email}`);
            if (response.data.length === 0) {
                setEmailAvailabilityStatus("available"); // البريد الإلكتروني متاح
            } else {
                setEmailAvailabilityStatus("notAvailable"); // البريد الإلكتروني غير متاح
            }
        } catch (error) {
            console.error(error); // إضافة log للخطأ في الكونسول
            setEmailAvailabilityStatus("failed"); // في حالة وجود خطأ في الخادم
        }
    };

    const resetCheckEmailAvailability = () => {
        setEmail(""); // إعادة تعيين البريد الإلكتروني المدخل
        setEmailAvailabilityStatus("idle");
    };

    return {
        resetCheckEmailAvailability,
        emailAvailabilityStatus,
        checkEmailAvailability,
        enteredEmail: email, // إرجاع البريد الإلكتروني المدخل
    };
};

export default useCheckEmailAvailability;


// import axios from "axios";
// import { useState } from "react";

// type TStatus = "idle" | "checking" | "available" | "notAvailable" | "failed";

// const useCheckEmailAvailability = () => {
//     const [emailAvailabilityStatus, setEmailAvailabilityStatus] =
//         useState<TStatus>("idle");

//     const [enteredEmail, setEnteredEmail] = useState<null | string>(null);
//     const checkEmailAvailability = async (email: string) => {
//         setEnteredEmail(email);
//         setEmailAvailabilityStatus("checking");
//         try {
//             const response = await axios.get(`/users?email=${email}`)
//         if (!response.data.length) {
//             setEmailAvailabilityStatus("available")
//         } else {
//             setEmailAvailabilityStatus("notAvailable")
//         }
        
        
//         } catch (error) {
//             setEmailAvailabilityStatus("failed")
//         }
//     }
//     const resetCheckEmailAvailability = () => {
//         setEmailAvailabilityStatus("idle");
//         setEnteredEmail(null);
//     };
    
//     return { resetCheckEmailAvailability,emailAvailabilityStatus, enteredEmail, checkEmailAvailability }
// }

// export default useCheckEmailAvailability
