import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/plan-de-estudios', label: 'Plan de estudios' },
  { to: '/planificar', label: 'Planificar cuatrimestre' },
];

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>Bio</span>
        <span className={styles.brandText}>Plan de Bioingeniería</span>
      </div>
      <nav className={styles.links}>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.linkActive : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
