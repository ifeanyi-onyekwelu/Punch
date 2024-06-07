import { Link } from "react-router-dom";

const NavLink = ({ location, value }: any) => {
    return (
        <li className="text-center">
            <Link to={location}>{value}</Link>
        </li>
    );
};

export default NavLink;
