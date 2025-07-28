
import { SubmitHandler, useForm } from "react-hook-form";
import { signInSchema, signInType } from "../validations/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useNavigate, useSearchParams } from "react-router-dom";
import actAuthLogin from "@store/auth/act/actAuthLogin";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { useEffect } from "react";
import { resetUI } from "@store/auth/authSlice";
import { actGetWishlist } from "@store/wishlist/wishlistSlice";


const useLogin = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const { error, loading, accessToken,user } = useAppSelector((e) => e.auth);

    const {
        register,
        handleSubmit,
        formState: { errors: formErrors },
    } = useForm<signInType>({
        mode: "onBlur",
        resolver: zodResolver(signInSchema),
    });

    const submitForm: SubmitHandler<signInType> = (data) => {
        if (searchParams.get("message") === "account_created") {
            setSearchParams("");
        }
        dispatch(actAuthLogin(data))
            .unwrap()
            .then((res) => {
                if (res.user.email?.toLowerCase().trim() === "mohnud0987@gmail.com") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            });
    };
    useEffect(() => {

        if (user?.id) {
            dispatch(actGetWishlist("productsFullInfo"));
        }
        return () => {
            dispatch(resetUI())
        }
    }, [dispatch, user?.id])


    return {
        error, loading, accessToken, register,
        handleSubmit, formErrors, submitForm, searchParams
}
}

export default useLogin
