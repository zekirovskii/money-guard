import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/auth/selectors';
import { selectTransactions, selectTotalBalance } from '../../redux/transactions/selectors';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Currency from '../../components/Currency/Currency';
import AddTransactionModal from '../../components/TransactionModal/AddTransactionModal';
import EditTransactionModal from '../../components/TransactionModal/EditTransactionModal';
import styles from './DashboardPage.module.css';
import ellipse14 from '../../assets/Ellipse14.svg';
import ellipse16 from '../../assets/Ellipse16.svg';
import ellipse18 from '../../assets/Ellipse18.svg';
import ellipse19 from '../../assets/Ellipse19.svg';
import ellipse20 from '../../assets/Ellipse20.svg';

const DashboardPage = () => {
  const user = useSelector(selectUser);
  const transactions = useSelector(selectTransactions);
  const totalBalance = useSelector(selectTotalBalance);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleEditClick = (transaction) => {
    setSelectedTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (transactionId) => {
    if (window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) {
      // Delete işlemi burada yapılacak
      console.log('Delete transaction:', transactionId);
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
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <Navigation />
          
          {/* Balance Section */}
          <div className={styles.balanceSection}>
            <h3 className={styles.balanceTitle}>YOUR BALANCE</h3>
            <div className={styles.balanceAmount}>₴ {totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          </div>
          
          {/* Currency Component - API'den veri çekiyor */}
          <Currency />
        </aside>
        
        {/* Main Content */}
        <main className={styles.mainContent}>
          <div className={styles.transactionsContainer}>
            <h2 className={styles.transactionsTitle}>Transactions</h2>
            
            <div className={styles.transactionsTable}>
              <div className={styles.tableHeader}>
                <span>Date</span>
                <span>Type</span>
                <span>Category</span>
                <span>Comment</span>
                <span>Sum</span>
                <span>Actions</span>
              </div>
              
              {transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div key={transaction.id} className={styles.tableRow}>
                    <span className={styles.date}>{transaction.transactionDate}</span>
                    <span className={`${styles.type} ${transaction.type === 'INCOME' ? styles.income : styles.expense}`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                    </span>
                    <span className={styles.category}>{transaction.categoryId}</span>
                    <span className={styles.comment}>{transaction.comment}</span>
                    <span className={styles.sum}>{transaction.amount}</span>
                    <div className={styles.actions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEditClick(transaction)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" className={styles.editIcon}>
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(transaction.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <p>Henüz transaction bulunmuyor. Yeni transaction eklemek için + butonuna tıklayın.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Floating Action Button */}
          <button 
            className={styles.fab}
            onClick={() => setIsAddModalOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" className={styles.fabIcon}>
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </main>
      </div>

      {/* Modals */}
      <AddTransactionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      
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
