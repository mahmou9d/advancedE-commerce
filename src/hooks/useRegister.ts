import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, signUpType } from "../validations/signUpSchema";
import useCheckEmailAvailability from "@hooks/useCheckEmailAvailability";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import actAuthRegister from "@store/auth/act/actAuthRegister";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { resetUI } from "@store/auth/authSlice";

const useRegister = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const { loading, error,accessToken } = useAppSelector((state) => state.auth)
    const { register, handleSubmit, formState: { errors: formErrors }, getFieldState, trigger } = useForm<signUpType>({ mode: "onBlur", resolver: zodResolver(signUpSchema) });
    const {
        resetCheckEmailAvailability,
        checkEmailAvailability,
        emailAvailabilityStatus,
        // enteredEmail,
    } = useCheckEmailAvailability();
    const submitForm: SubmitHandler<signUpType> = async (data) => {
        const { firstName, lastName, email, password } = data;
        dispatch(actAuthRegister({ firstName, lastName, email, password }))
            .unwrap()
            .then(() => {
                navigate("/login?message=account_created");
            })
    };
    const emailOnBlurHandler = async (e: React.FocusEvent<HTMLInputElement>) => {
        await trigger("email");
        const value = e.target.value;
        const { invalid, isDirty } = getFieldState("email");
        if (isDirty && !invalid ) {
            checkEmailAvailability(value);
        }
        if (isDirty && !invalid ) {
            resetCheckEmailAvailability();
        }
    };
    useEffect(() => {
        return () => {
            dispatch(resetUI())
        }
    }, [dispatch])
    return {
        loading,
        error,
        accessToken,
        formErrors,
        emailAvailabilityStatus,
        submitForm,
        register,
        handleSubmit,
        emailOnBlurHandler,
    }

}

export default useRegister
