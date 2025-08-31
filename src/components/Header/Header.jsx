import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../redux/auth/selectors';
import { logoutUser } from '../../redux/auth/operations';
import LogoutModal from '../LogoutModal/LogoutModal';
import loginLogo from '../../assets/login-logo.svg';
import styles from './Header.module.css';

const Header = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    setIsModalOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* Sol taraf - Logo ve uygulama adı */}
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <img src={loginLogo} alt="Money Guard Logo" className={styles.logoIcon} />
            </div>
            <h1 className={styles.appName}>Money Guard</h1>
          </div>

          {/* Sağ taraf - Kullanıcı bilgisi ve çıkış */}
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.username || 'Kullanıcı'}</span>
            </div>
            <div className={styles.separator}></div>
            <button onClick={handleLogoutClick} className={styles.logoutButton}>
              <svg viewBox="0 0 24 24" fill="none" className={styles.logoutIcon}>
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.logoutText}>Exit</span>
            </button>
          </div>
        </div>
      </header>

      <LogoutModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default Header;