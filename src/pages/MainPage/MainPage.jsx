import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../redux/auth/selectors';
import { logoutUser } from '../../redux/auth/operations';
import Header from '../../components/Header/Header';
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
      <Header />
      
      <div className={styles.container}>
        <h1 className={styles.welcomeText}>
          Hoşgeldiniz, Kullanıcı!
        </h1>
        <p className={styles.subtitle}>
          Money Guard uygulamasına başarıyla giriş yaptınız.
        </p>
      </div>
    </div>
  );
};

export default MainPage;