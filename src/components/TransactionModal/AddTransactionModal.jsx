import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction } from '../../redux/transactions/operations';
import { selectTransactionCategories } from '../../redux/transactions/selectors';
import styles from './TransactionModal.module.css';

const AddTransactionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectTransactionCategories);
  
  const [formData, setFormData] = useState({
    type: 'INCOME',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    comment: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount || !formData.date) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      // Backend API'sine uygun format
      const transactionData = {
        transactionDate: formData.date,  // "date" değil "transactionDate"
        type: formData.type,
        categoryId: formData.category,   // "category" değil "categoryId"
        comment: formData.comment,
        amount: parseFloat(formData.amount)
      };

      await dispatch(addTransaction(transactionData)).unwrap();
      
      // Form'u sıfırla
      setFormData({
        type: 'INCOME',
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        comment: ''
      });
      
      onClose();
    } catch (error) {
      console.error('Transaction eklenirken hata:', error);
      alert('Transaction eklenirken hata oluştu: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add transaction</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <svg viewBox="0 0 24 24" fill="none" className={styles.closeIcon}>
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Transaction Type Toggle */}
          <div className={styles.typeToggle}>
            <button
              type="button"
              className={`${styles.toggleOption} ${formData.type === 'INCOME' ? styles.active : ''}`}
              onClick={() => handleInputChange('type', 'INCOME')}
            >
              Income
            </button>
            <button
              type="button"
              className={`${styles.toggleOption} ${formData.type === 'EXPENSE' ? styles.active : ''}`}
              onClick={() => handleInputChange('type', 'EXPENSE')}
            >
              Expense
            </button>
          </div>

          {/* Category Selection */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Select a category</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className={styles.select}
              required
            >
              <option value="">Select a category</option>
              {categories && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount and Date Row */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <input
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className={styles.input}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          {/* Comment */}
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Comment"
              value={formData.comment}
              onChange={(e) => handleInputChange('comment', e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Action Buttons */}
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.addButton}>
              ADD
            </button>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
