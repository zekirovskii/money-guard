import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors';
import {
  selectTransactions,
  selectTotalBalance,
  selectTransactionCategories,
} from '../../redux/transactions/selectors';
import { deleteTransaction, getTransactions } from '../../redux/transactions/operations';

import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Currency from '../../components/Currency/Currency';
import AddTransactionModal from '../../components/TransactionModal/AddTransactionModal';
import EditTransactionModal from '../../components/TransactionModal/EditTransactionModal';
import EmptyTransactions from '../../components/EmptyStates/EmptyTransactions';

import styles from './DashboardPage.module.css';
import ellipse14 from '../../assets/Ellipse14.svg';
import ellipse16 from '../../assets/Ellipse16.svg';
import ellipse18 from '../../assets/Ellipse18.svg';
import ellipse19 from '../../assets/Ellipse19.svg';
import ellipse20 from '../../assets/Ellipse20.svg';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const transactions = useSelector(selectTransactions);
  const totalBalance = useSelector(selectTotalBalance);
  const categories = useSelector(selectTransactionCategories);

  // Category'leri yükle
  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  // Category ID -> Name
  const getCategoryName = (categoryId) => {
    if (!categories || !categoryId) return 'Unknown';
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Debug
  console.log('Dashboard Debug Info:', {
    user,
    transactionsCount: transactions?.length || 0,
    totalBalance,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleAddClick = () => setIsAddModalOpen(true);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (transactionId) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      try {
        await dispatch(deleteTransaction(transactionId)).unwrap();
      } catch (error) {
        console.error('Transaction silinirken hata:', error);
        alert('Transaction silinirken hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Background SVG Elements */}
      <img src={ellipse14} alt="" className={styles.ellipse14} />
      <img src={ellipse16} alt="" className={styles.ellipse16} />
      <img src={ellipse18} alt="" className={styles.ellipse18} />
      <img src={ellipse19} alt="" className={styles.ellipse19} />
      <img src={ellipse20} alt="" className={styles.ellipse20} />

      <Header />

      <div className={styles.mainContainer}>
        {/* Tablet için üst kısım - Navigation, Balance ve Currency */}
        <div className={styles.topSection}>
          <aside className={styles.sidebar}>
            {/* Sol taraf - Navigation ve Balance */}
            <div className={styles.leftSidebarContent}>
              <Navigation />

              {/* Balance */}
              <div className={styles.balanceSection}>
                <h3 className={styles.balanceTitle}>YOUR BALANCE</h3>
                <div className={styles.balanceAmount}>€ {totalBalance}</div>
              </div>
            </div>

            {/* Sağ taraf - Currency */}
            <div className={styles.currencySection}>
              <Currency />
            </div>
          </aside>
        </div>

        {/* Alt kısım - Transaction Table */}
        <main className={styles.mainContent}>
          <div className={styles.transactionsContainer}>
            <div className={styles.transactionsTable}>
              <div className={styles.tableHeader}>
                <span>Date</span>
                <span>Type</span>
                <span>Category</span>
                <span>Comment</span>
                <span>Sum</span>
              </div>

              {transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} className={styles.tableRow}>
                    {/* Desktop/Tablet Layout */}
                    <span className={styles.date}>{transaction.transactionDate}</span>
                    <span
                      className={`${styles.type} ${
                        transaction.type === 'INCOME' ? styles.income : styles.expense
                      }`}
                    >
                      {transaction.type === 'INCOME' ? '+' : '-'}
                    </span>
                    <span className={styles.category}>
                      {getCategoryName(transaction.categoryId)}
                    </span>
                    <span className={styles.comment}>{transaction.comment}</span>
                    <span
                      className={`${styles.sum} ${
                        transaction.amount >= 0 ? styles.positive : styles.negative
                      }`}
                    >
                      {Math.abs(transaction.amount)}
                    </span>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => handleEditClick(transaction)}
                        aria-label="Edit transaction"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className={styles.editIcon}>
                          <path
                            d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(transaction.id)}
                      >
                        Delete
                      </button>
                    </div>

                    {/* Mobile Card Layout - Sadece mobilde görünür */}
                    <div className={styles.mobileCard}>
                      <div className={styles.transactionCardRow}>
                        <span className={styles.transactionCardLabel}>Date</span>
                        <span className={styles.transactionCardValue}>{transaction.transactionDate}</span>
                      </div>
                      <div className={styles.transactionCardRow}>
                        <span className={styles.transactionCardLabel}>Type</span>
                        <span
                          className={`${styles.transactionCardValue} ${styles.type} ${
                            transaction.type === 'INCOME' ? styles.income : styles.expense
                          }`}
                        >
                          {transaction.type === 'INCOME' ? '+' : '-'}
                        </span>
                      </div>
                      <div className={styles.transactionCardRow}>
                        <span className={styles.transactionCardLabel}>Category</span>
                        <span className={styles.transactionCardValue}>
                          {getCategoryName(transaction.categoryId)}
                        </span>
                      </div>
                      <div className={styles.transactionCardRow}>
                        <span className={styles.transactionCardLabel}>Comment</span>
                        <span className={styles.transactionCardValue}>{transaction.comment}</span>
                      </div>
                      <div className={styles.transactionCardRow}>
                        <span className={styles.transactionCardLabel}>Sum</span>
                        <span
                          className={`${styles.transactionCardValue} ${styles.sum} ${
                            transaction.amount >= 0 ? styles.positive : styles.negative
                          }`}
                        >
                          €{Math.abs(transaction.amount)}
                        </span>
                      </div>
                      <div className={styles.mobileActions}>
                        <button
                          className={styles.mobileDeleteButton}
                          onClick={() => handleDeleteClick(transaction.id)}
                        >
                          Delete
                        </button>
                        <button
                          className={styles.mobileEditButton}
                          onClick={() => handleEditClick(transaction)}
                          aria-label="Edit transaction"
                        >
                          <svg viewBox="0 0 24 24" fill="none" className={styles.editIcon}>
                            <path
                              d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.tableEmptyWrap}>
                  <EmptyTransactions onAdd={handleAddClick} />
                </div>
              )}
            </div>
          </div>

          {/* Floating Action Button */}
          <button className={styles.fab} onClick={handleAddClick}>
            <span className={styles.fabIcon}>+</span>
          </button>
        </main>
      </div>

      {/* Modals */}
      <AddTransactionModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </div>
  );
};

export default DashboardPage;