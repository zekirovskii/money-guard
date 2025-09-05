import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors';
import { selectTotalBalance } from '../../redux/transactions/selectors';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Currency from '../../components/Currency/Currency';
import StatisticsDashboard from '../../components/StatisticsDashboard/StatisticsDashboard';
import styles from './StatisticsPage.module.css';
import ellipse14 from '../../assets/Ellipse14.svg';
import ellipse16 from '../../assets/Ellipse16.svg';
import ellipse18 from '../../assets/Ellipse18.svg';
import ellipse19 from '../../assets/Ellipse19.svg';
import ellipse20 from '../../assets/Ellipse20.svg';

const StatisticsPage = () => {
  const user = useSelector(selectUser);
  const totalBalance = useSelector(selectTotalBalance);

  return (
    <div className={styles.statisticsPage}>
      {/* Background SVG Elements */}
      <img src={ellipse14} alt="" className={styles.ellipse14} />
      <img src={ellipse16} alt="" className={styles.ellipse16} />
      <img src={ellipse18} alt="" className={styles.ellipse18} />
      <img src={ellipse19} alt="" className={styles.ellipse19} />
      <img src={ellipse20} alt="" className={styles.ellipse20} />
      
      <Header />
      
      <div className={styles.mainContainer}>
        {/* Desktop Sidebar */}
        <aside className={styles.sidebar}>
          <Navigation />
          
          {/* Balance Section */}
          <div className={styles.balanceSection}>
            <h3 className={styles.balanceTitle}>YOUR BALANCE</h3>
            <div className={styles.balanceAmount}>₴ {totalBalance}</div>
          </div>
          
          {/* Currency Component - API'den veri çekiyor */}
          <Currency />
        </aside>
        
        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.content}>
            <h1 className={styles.pageTitle}>Statistics</h1>
            <StatisticsDashboard />
          </div>
        </main>
      </div>

      {/* Tablet Layout - DashboardPage gibi */}
      <div className={styles.tabletContainer}>
        {/* Tablet için üst kısım - Navigation, Balance ve Currency */}
        <div className={styles.topSection}>
          <aside className={styles.sidebar}>
            {/* Sol taraf - Navigation ve Balance */}
            <div className={styles.leftSidebarContent}>
              <Navigation />

              {/* Balance */}
              <div className={styles.balanceSection}>
                <h3 className={styles.balanceTitle}>YOUR BALANCE</h3>
                <div className={styles.balanceAmount}>₴ {totalBalance}</div>
              </div>
            </div>

            {/* Sağ taraf - Currency */}
            <div className={styles.currencySection}>
              <Currency />
            </div>
          </aside>
        </div>

        {/* Alt kısım - Statistics Dashboard */}
        <main className={styles.mainContent}>
          <div className={styles.statisticsContainer}>
            <h1 className={styles.pageTitle}>Statistics</h1>
            <StatisticsDashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StatisticsPage;
