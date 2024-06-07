import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { register } from "./AuthSlice";
import { RootState, AppDispatch } from "@/app/store";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import AuthLabel from "../../components/AuthLabel";
import AuthInput from "../../components/AuthInput";

import Background from "../../assets/img/Background.jpg";
import Logo from "../../assets/img/Logo.png";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    password2?: string;
    role: number[];
}

const Register = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password2: "",
        role: [5501],
    });
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const firstNameRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);

    const { error, loading } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (firstNameRef.current) firstNameRef.current.focus();
    }, []);

    useEffect(() => {
        if (formData.password.length >= 1 && formData.password.length < 6) {
            setErrorMessage(
                "Password must be at 6 characters long. Can contain only letters, numbers and special characters"
            );
        } else if (
            formData.password.length > 1 &&
            formData.password2 !== formData.password
        ) {
            setErrorMessage("Password must be match!");
        } else {
            setErrorMessage("");
        }
    }, [formData.password, formData.password2]);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        dispatch(register(formData));
        formData.firstName = "";
        formData.lastName = "";
        formData.email = "";
        formData.password = "";
        formData.password2 = "";
        console.log("Submitted!");
    };

    const content = (
        <div className="auth size-full h-dvh bg-slate-700 flex">
            <div className="side-content w-1/2 h-full p-6">
                <img
                    src={Background}
                    alt=""
                    className="w-full h-full rounded-e-full"
                />
            </div>

            <div className="auth-form w-1/2 grid place-content-center">
                <form
                    method="post"
                    className="auth-form__form size-96 flex justify-center flex-col p-4"
                    onSubmit={onSubmit}
                >
                    <Link to={"/"}>
                        <img src={Logo} alt="" className="w-2/5 mb-10" />
                    </Link>
                    <h2 className="text-6xl font-semibold mb-4 text-yellow-50">
                        Register
                    </h2>
                    {error && (
                        <div
                            className="auth-form__error w-full p-2 mb-2 text-center rounded-md text-white bg-red-700"
                            ref={errorRef}
                        >
                            {error}
                        </div>
                    )}

                    <div className="auth-form__form_group">
                        <AuthLabel htmlFor="firstName" value="First Name" />
                        <AuthInput
                            type="text"
                            name="firstName"
                            ref={firstNameRef}
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={onChange}
                        />
                    </div>
                    <div className="auth-form__form_group">
                        <AuthLabel htmlFor="lastName" value="Last Name" />
                        <AuthInput
                            type="text"
                            name="lastName"
                            ref={null}
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={onChange}
                        />
                    </div>
                    <div className="auth-form__form_group">
                        <AuthLabel htmlFor="email" value="Email Address" />
                        <AuthInput
                            type="email"
                            name="email"
                            ref={null}
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={onChange}
                        />
                    </div>
                    <div className="auth-form__form_group">
                        <AuthLabel htmlFor="password" value="Password" />
                        <AuthInput
                            type="password"
                            name="password"
                            ref={null}
                            placeholder="Password"
                            value={formData.password}
                            onChange={onChange}
                        />
                    </div>
                    <div className="auth-form__form_group">
                        <AuthLabel
                            htmlFor="password2"
                            value="Re-enter Password"
                        />
                        <AuthInput
                            type="password"
                            name="password2"
                            ref={null}
                            placeholder="Re-enter Password"
                            value={formData.password2}
                            onChange={onChange}
                        />
                    </div>
                    <Button
                        type="submit"
                        value="Register"
                        submitted={submitted}
                    />

                    <p className="text-white">
                        Already have an account?
                        <Link
                            to={"/auth/login"}
                            className="text-slate-300 hover:text-slate-800"
                        >
                            Get one here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );

    return content;
};

export default Register;
