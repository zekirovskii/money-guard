import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/auth/operations';
import { selectLoading, selectError, selectIsAuthenticated } from '../../redux/auth/selectors';
import styles from './Loginform.module.css';
import loginLogo from '../../assets/login-logo.svg';

const schema = yup.object({
  email: yup.string().email('Geçerli bir email adresi giriniz').required('Email zorunludur'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').max(12, 'Şifre en fazla 12 karakter olmalıdır').required('Şifre zorunludur'),
}).required();

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [formErrors, setFormErrors] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Login error:', error);
    }
  }, [error]);

  const onSubmit = async (data) => {
    try {
      // Manual validation
      await schema.validate(data, { abortEarly: false });
      setFormErrors({});
      await dispatch(loginUser(data)).unwrap();
    } catch (validationError) {
      if (validationError.inner) {
        const errors = {};
        validationError.inner.forEach((error) => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      } else {
        console.error('Login failed:', validationError);
      }
    }
  };

  const handleRegisterClick = () => {
    dispatch(clearError());
    navigate('/register');
  };

  return (
    <div className={styles.authCard}>
      {/* Logo Section */}
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <img src={loginLogo} alt="Money Guard Logo" className={styles.logoIcon} />
        </div>
        <h1 className={styles.brandName}>Money Guard</h1>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <div className={styles.inputIcon}>
            <svg viewBox="0 0 24 24" fill="none" className={styles.icon}>
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" fill="none"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <input
            type="email"
            placeholder="E-mail"
            {...register('email')}
            className={`${styles.inputField} ${formErrors.email ? styles.error : ''}`}
          />
          {formErrors.email && <span className={styles.errorMessage}>{formErrors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputIcon}>
            <svg viewBox="0 0 24 24" fill="none" className={styles.icon}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <input
            type="password"
            placeholder="Password"
            {...register('password')}
            className={`${styles.inputField} ${formErrors.password ? styles.error : ''}`}
          />
          {formErrors.password && <span className={styles.errorMessage}>{formErrors.password}</span>}
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button 
          type="submit" 
          className={`${styles.btn} ${styles.btnPrimary} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          {loading ? 'Giriş yapılıyor...' : 'LOG IN'}
        </button>

        <button 
          type="button" 
          onClick={handleRegisterClick}
          className={`${styles.btn} ${styles.btnSecondary}`}
        >
          REGISTER
        </button>
      </form>
    </div>
  );
};

export default LoginForm;