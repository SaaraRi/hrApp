import { NavLink, Link } from "react-router";
import { useEffect, useState } from "react";
import logo from "../../assets/images/icons8-employee-100.png";
import styles from "./Header.module.css";

const Header = () => {
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
    <header
      style={{
        backgroundColor: scrolled ? "#f1f3f8" : "transparent",
        boxShadow: scrolled
          ? "0 10px 18px rgba(0, 0, 0, 0.25), 0 7px 7px rgba(0, 0, 0, 0.22)"
          : "none",
      }}
    >
      <div className={styles.logo}>
        <Link to="/employees">
          <img src={logo} alt="" />
        </Link>
      </div>
      <nav>
        <ul>
          <NavLink to="/employees" className={styles.menuLink}>
            Employees List
          </NavLink>
          <NavLink to="/add" className={styles.menuLink}>
            Add Employee
          </NavLink>
          <NavLink to="/about" className={styles.menuLink}>
            About
          </NavLink>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
