import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import homeIcon from '../../assets/home.svg';
import statisticIcon from '../../assets/statistic.svg';
import currencyIcon from '../../assets/currency.svg';
import currencyHoverIcon from '../../assets/currency-hover.svg';
import styles from './Navigation.module.css';

const Navigation = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

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
    },
    {
      path: '/currency',
      label: 'Currency',
      icon: currencyIcon,
      mobileOnly: true
    }
  ];

  return (
    <nav className={styles.navigation}>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `${styles.navItem} ${isActive ? styles.active : ''} ${item.mobileOnly ? styles.mobileOnly : ''}`
          }
          onMouseEnter={() => setHoveredItem(item.path)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className={styles.iconContainer}>
            <img 
              src={hoveredItem === item.path && item.hoverIcon ? item.hoverIcon : item.icon} 
              alt={item.label} 
              className={styles.navIcon} 
            />
          </div>
          <span className={styles.navLabel}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;

