import React from 'react';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Currency from '../../components/Currency/Currency';
import styles from './CurrencyPage.module.css';
import ellipse14 from '../../assets/Ellipse14.svg';
import ellipse16 from '../../assets/Ellipse16.svg';
import ellipse18 from '../../assets/Ellipse18.svg';
import ellipse19 from '../../assets/Ellipse19.svg';
import ellipse20 from '../../assets/Ellipse20.svg';

const CurrencyPage = () => {
  return (
    <div className={styles.currencyPage}>
      {/* Background SVG Elements */}
      <img src={ellipse14} alt="" className={styles.ellipse14} />
      <img src={ellipse16} alt="" className={styles.ellipse16} />
      <img src={ellipse18} alt="" className={styles.ellipse18} />
      <img src={ellipse19} alt="" className={styles.ellipse19} />
      <img src={ellipse20} alt="" className={styles.ellipse20} />

      <Header />
      
      <div className={styles.mainContainer}>
        <div className={styles.content}>
          <Navigation />
          <Currency />
        </div>
      </div>
    </div>
  );
};

export default CurrencyPage;
