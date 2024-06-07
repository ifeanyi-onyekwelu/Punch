const AuthLabel = ({ htmlFor, value }: any) => {
    return (
        <label htmlFor={htmlFor} className="absolute -left-60">
            {value}
        </label>
    );
};

export default AuthLabel;
