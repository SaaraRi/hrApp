import { NavLink, Link } from 'react-router';
import "./Header.css";

const Header = ({ name }) => {
    return (
        <header>
            <div className="logo">
                <Link to="/">
                    <h2>{name}</h2>
                </Link>
            </div>
            <nav>
                <ul>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/list">Employees List</NavLink>
                    <NavLink to="/add">Add Employee</NavLink>
                </ul>
            </nav>
        </header>
    )
};

export default Header;