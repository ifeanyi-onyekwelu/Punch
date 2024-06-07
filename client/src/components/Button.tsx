import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Button = ({
    value,
    type,
    submitted,
}: {
    value: string;
    type: "button" | "submit" | "reset";
    submitted: any;
}) => {
    return (
        <>
            {submitted ? (
                <button
                    type={type}
                    className="Button py-2 px-7 bg-cyan-800 rounded-sm text-white font-bold hover:bg-cyan-900"
                    disabled
                >
                    <FontAwesomeIcon icon={faSpinner}></FontAwesomeIcon>
                </button>
            ) : (
                <button
                    type={type}
                    className="Button py-2 px-7 bg-cyan-800 rounded-sm text-white font-bold hover:bg-cyan-900"
                >
                    value
                </button>
            )}
        </>
    );
};

export default Button;
