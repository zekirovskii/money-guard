import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../redux/auth/selectors';
import { logoutUser } from '../../redux/auth/operations';
import styles from './MainPage.module.css';

const MainPage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className={styles.mainPage}>
      {/* Logout Icon */}
      <div className={styles.logoutContainer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <svg viewBox="0 0 24 24" fill="none" className={styles.logoutIcon}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className={styles.container}>
        <h1 className={styles.welcomeText}>
          Hoşgeldiniz, {user?.name || 'Kullanıcı'}!
        </h1>
        <p className={styles.subtitle}>
          Money Guard uygulamasına başarıyla giriş yaptınız.
        </p>
      </div>
    </div>
  );
};

export default MainPage;