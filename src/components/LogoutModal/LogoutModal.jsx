import React from 'react';
import loginLogo from '../../assets/login-logo.svg';
import styles from './LogoutModal.module.css';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalContent}>
          {/* Logo ve uygulama adı */}
          <div className={styles.logoSection}>
            <img src={loginLogo} alt="Money Guard Logo" className={styles.logo} />
            <h2 className={styles.appName}>Money Guard</h2>
          </div>
          
          {/* Onay mesajı */}
          <p className={styles.confirmMessage}>
            Are you sure you want to log out?
          </p>
          
          {/* Butonlar */}
          <div className={styles.buttonContainer}>
            <button onClick={onConfirm} className={styles.logoutButton}>
              LOGOUT
            </button>
            <button onClick={onClose} className={styles.cancelButton}>
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
