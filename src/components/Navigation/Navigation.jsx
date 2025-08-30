import React from 'react';
import { NavLink } from 'react-router-dom';
import homeIcon from '../../assets/home.svg';
import statisticIcon from '../../assets/statistic.svg';
import styles from './Navigation.module.css';

const Navigation = () => {
  const navItems = [
    {
      path: '/home',
      label: 'Home',
      icon: homeIcon
    },
    {
      path: '/statistics',
      label: 'Statistics',
      icon: statisticIcon
    }
  ];

  return (
    <nav className={styles.navigation}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `${styles.navItem} ${isActive ? styles.active : ''}`
          }
        >
          <div className={styles.iconContainer}>
            <img src={item.icon} alt={item.label} className={styles.navIcon} />
          </div>
          <span className={styles.navLabel}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;

