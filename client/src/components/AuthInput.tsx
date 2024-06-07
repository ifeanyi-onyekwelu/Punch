import React from "react";

const AuthInput = ({ type, name, ref, placeholder, value, onChange }: any) => {
    return (
        <input
            type={type}
            name={name}
            id={name}
            className="auth-form__input w-full h-10 rounded-sm bg-inherit border-b-2 text-white mb-2 outline-none"
            ref={ref}
            placeholder={placeholder}
            aria-label={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default AuthInput;
