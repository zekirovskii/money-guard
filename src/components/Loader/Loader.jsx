import React from 'react';
import { useSelector } from 'react-redux';
import styles from './Loader.module.css';

const Loader = () => {
  const isLoading = useSelector((state) => state.transactions.isLoading);

  if (!isLoading) return null;

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
