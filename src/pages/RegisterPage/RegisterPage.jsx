import React from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css';
import moneyBg from '../../assets/money-bg.png';

const RegisterPage = () => {
  return (
    <div className={styles.registerPage}>
      {/* Background image */}
      <div className={styles.backgroundImage} style={{ backgroundImage: `url(${moneyBg})` }}></div>
      
      <div className={styles.container}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
