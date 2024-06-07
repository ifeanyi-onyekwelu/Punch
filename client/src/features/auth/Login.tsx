import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/Button";
import { RootState, AppDispatch } from "@/app/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { login } from "./AuthSlice";
import AuthLabel from "../../components/AuthLabel";
import AuthInput from "../../components/AuthInput";

import Background from "../../assets/img/Background.jpg";
import Logo from "../../assets/img/Logo.png";

interface FormData {
    email: string;
    password: string;
}

const Login = () => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
    });
    const [submitted, setSubmitted] = useState<boolean>(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const errorRef = useRef<HTMLDivElement>(null);

    // Selectors
    const { error } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (emailRef.current) emailRef.current.focus();
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        const response = await dispatch(login(formData));
        console.log("Response: ", response);

        formData.email = "";
        formData.password = "";
    };

    const content = (
        <>
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
                            Login
                        </h2>
                        {error && (
                            <div
                                className="auth-form__error w-full p-2 mb-2 text-center rounded-md text-white bg-red-700"
                                ref={errorRef}
                            >
                                {error}
                            </div>
                        )}

                        <div className="auth-form__form-group">
                            <AuthLabel htmlFor="email" value="Email Address" />
                            <AuthInput
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="Email Address"
                                ref={emailRef}
                                onChange={onChange}
                            />
                        </div>
                        <div className="auth-form__form-group">
                            <AuthLabel htmlFor="password" value="Password" />
                            <AuthInput
                                type="password"
                                name="password"
                                value={formData.password}
                                placeholder="Password"
                                onChange={onChange}
                            />
                        </div>
                        <Button
                            type="submit"
                            value="Log In"
                            submitted={submitted}
                        />
                        <p className="text-white">
                            Don't have an account?{" "}
                            <Link
                                to={"/auth/register"}
                                className="text-slate-300 hover:text-slate-800"
                            >
                                Get one here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
    return content;
};

export default Login;
