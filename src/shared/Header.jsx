import '../App.css';
import styles from '../App.module.css';
import logo from '../assets/todo-list-svgrepo-com.svg';
import { NavLink } from 'react-router';

function Header({ title }) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? styles.active : styles.inactive
          }
        >
          About
        </NavLink>
      </nav>
      <h1 className={styles.title}>
        <span className={styles.titleRow}>
          <img className={styles.logoImg} src={logo} alt="Todo logo" />
          {title}
        </span>
      </h1>
    </header>
  );
}

export default Header;
