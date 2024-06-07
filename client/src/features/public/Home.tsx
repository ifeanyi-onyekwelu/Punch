import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import NavLink from "../../components/NavLink";

const Home = () => {
    const content = (
        <div className="home-container h-screen grid place-content-center">
            <div className="hero-content bg-blue-400 size-72 rounded-sm shadow-md shadow-gray-700">
                <h1 className="text-3xl mb-5 text-center font-semibold font-sans">
                    Welcome to <span>PTM</span>
                </h1>
                <ul>
                    <NavLink location="/auth/login" value="Login" />
                    <NavLink location="/auth/register" value="Register" />
                    <NavLink
                        location="/terms-and-condition"
                        value="Terms &amp; Conditions"
                    />
                </ul>
            </div>
        </div>
    );
    return content;
};

export default Home;
