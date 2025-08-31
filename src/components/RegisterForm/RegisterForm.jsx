import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading, selectError, selectIsAuthenticated } from '../../redux/auth/selectors';
import { registerUser, clearError } from '../../redux/auth/operations';
import styles from './RegisterForm.module.css';
import loginLogo from '../../assets/login-logo.svg';

const schema = yup.object({
  name: yup.string().required('İsim zorunludur'),
  email: yup.string().email('Geçerli bir email adresi giriniz').required('Email zorunludur'),
  password: yup.string().min(6, 'Şifre en az 6 karakter olmalıdır').max(12, 'Şifre en fazla 12 karakter olmalıdır').required('Şifre zorunludur'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Şifreler eşleşmiyor').required('Şifre tekrarı zorunludur'),
}).required();

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema)
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      console.error('Register error:', error);
    }
  }, [error]);

  useEffect(() => {
    if (password && confirmPassword) {
      const strength = password === confirmPassword ? 100 : 0;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password, confirmPassword]);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerUser(data)).unwrap();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLoginClick = () => {
    dispatch(clearError());
    navigate('/login');
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

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <div className={styles.inputIcon}>
            <svg viewBox="0 0 24 24" fill="none" className={styles.icon}>
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Name"
            {...register('name')}
            className={`${styles.inputField} ${errors.name ? styles.error : ''}`}
          />
          {errors.name && <span className={styles.errorMessage}>{errors.name.message}</span>}
        </div>

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
            className={`${styles.inputField} ${errors.email ? styles.error : ''}`}
          />
          {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
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
            className={`${styles.inputField} ${errors.password ? styles.error : ''}`}
          />
          {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
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
            placeholder="Confirm password"
            {...register('confirmPassword')}
            className={`${styles.inputField} ${errors.confirmPassword ? styles.error : ''}`}
          />
          {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword.message}</span>}
        </div>

        {/* Progress Bar */}
        {password && confirmPassword && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>
              {passwordStrength === 100 ? 'Şifreler eşleşiyor' : 'Şifreler eşleşmiyor'}
            </span>
          </div>
        )}

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button 
          type="submit" 
          className={`${styles.btn} ${styles.btnPrimary} ${loading ? styles.loading : ''}`}
          disabled={loading}
        >
          {loading ? 'Kayıt olunuyor...' : 'REGISTER'}
        </button>

        <button 
          type="button" 
          onClick={handleLoginClick}
          className={`${styles.btn} ${styles.btnSecondary}`}
        >
          LOG IN
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;