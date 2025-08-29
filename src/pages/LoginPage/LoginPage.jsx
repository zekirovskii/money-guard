import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css';
import coinBg from '../../assets/coin-bg.png';

const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      {/* Background image */}
      <div className={styles.backgroundImage} style={{ backgroundImage: `url(${coinBg})` }}></div>
      
      <div className={styles.container}>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;