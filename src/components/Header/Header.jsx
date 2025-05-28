import { NavLink, Link } from "react-router";
import { useEffect, useState } from "react";
import "./Header.css";

const Header = ({ name }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled =
        window.scrollY > 80 || document.documentElement.scrollTop > 80;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header style={{ backgroundColor: scrolled ? "white" : "transparent" }}>
      <div className="logo">
        <Link to="/">
          <h2>{name}</h2>
        </Link>
      </div>
      <nav>
        <ul>
          <NavLink to="/employees">Employees List</NavLink>
          <NavLink to="/add">Add Employee</NavLink>
          <NavLink to="/about">About</NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
