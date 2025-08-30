import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editTransaction } from '../../redux/transactions/operations';
import { selectTransactionCategories } from '../../redux/transactions/selectors';
import styles from './TransactionModal.module.css';

const EditTransactionModal = ({ isOpen, onClose, transaction }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectTransactionCategories);
  
  const [formData, setFormData] = useState({
    type: 'INCOME',
    category: '',
    amount: '',
    date: '',
    comment: ''
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type || 'INCOME',
        category: transaction.categoryId || '',  // Backend'den gelen "categoryId"
        amount: transaction.amount || '',
        date: transaction.transactionDate || new Date().toISOString().split('T')[0],  // Backend'den gelen "transactionDate"
        comment: transaction.comment || ''
      });
    }
  }, [transaction]);

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
        transactionDate: formData.date,
        type: formData.type,
        categoryId: formData.category,
        comment: formData.comment,
        amount: parseFloat(formData.amount)
      };

      await dispatch(editTransaction({
        id: transaction.id,
        updates: transactionData
      })).unwrap();
      
      onClose();
    } catch (error) {
      console.error('Transaction güncellenirken hata:', error);
      alert('Transaction güncellenirken hata oluştu: ' + error.message);
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit transaction</h2>
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
            <button type="submit" className={styles.saveButton}>
              SAVE
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

export default EditTransactionModal;