import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTransaction } from "../../redux/transactions/operations";
import { selectTransactionCategories } from "../../redux/transactions/selectors";
import styles from "./TransactionModal.module.css";

const AddTransactionModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectTransactionCategories) || [];

  const [formData, setFormData] = useState({
    type: "INCOME",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    comment: "",
  });

  // INCOME için otomatik kategori bağla, EXPENSE'te sıfırla
  useEffect(() => {
    if (formData.type === "INCOME") {
      const incomeCat = categories.find((c) => c.type === "INCOME");
      if (incomeCat?.id) {
        setFormData((p) => ({ ...p, category: incomeCat.id }));
      }
    } else {
      setFormData((p) => ({ ...p, category: "" }));
    }
  }, [formData.type, categories]);

  const setField = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  const toggleType = () =>
    setFormData((p) => ({ ...p, type: p.type === "INCOME" ? "EXPENSE" : "INCOME" }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.type === "EXPENSE" && !formData.category) {
      alert("Lütfen bir kategori seçin.");
      return;
    }

    const n = Number(formData.amount);
    if (!formData.amount || Number.isNaN(n) || n <= 0) {
      alert("Lütfen 0'dan büyük geçerli bir miktar girin.");
      return;
    }
    if (!formData.date) {
      alert("Lütfen tarih seçin.");
      return;
    }

    if (formData.type === "INCOME" && !formData.category) {
      alert("INCOME kategorisi bulunamadı. Lütfen sayfayı yenileyin.");
      return;
    }

    try {
      const payload = {
        transactionDate: formData.date,
        type: formData.type,
        categoryId: formData.category,
        comment: formData.comment || "",
        amount: formData.type === "EXPENSE" ? -n : n,
      };

      await dispatch(addTransaction(payload)).unwrap();

      // Form'u sıfırla
      const resetFormData = {
        type: "INCOME",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        comment: "",
      };

      // Income için category'yi otomatik seç
      if (resetFormData.type === "INCOME") {
        const incomeCat = categories.find((c) => c.type === "INCOME");
        if (incomeCat?.id) {
          resetFormData.category = incomeCat.id;
        }
      } else {
        resetFormData.category = "";
      }

      setFormData(resetFormData);
      onClose?.();
    } catch (err) {
      console.error('Add transaction error:', err);
      alert(err?.message || "İşlem eklenirken hata oluştu.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onMouseDown={onClose}>
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add transaction</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" className={styles.closeIcon}>
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* ---------- SOLDAN 'Income' | ORTA SWITCH | SAĞDAN 'Expense' ---------- */}
          <div className={styles.switcheWrapper}>
            <span className={formData.type === "INCOME" ? styles.income : ""}>
              Income
            </span>

            {/* Checkbox + label switcher (checked => EXPENSE) */}
            <input
              id="switcherButton"
              type="checkbox"
              checked={formData.type === "EXPENSE"}
              onChange={toggleType}
              className={styles.switchInput}
            />
            <label
              htmlFor="switcherButton"
              className={`${styles.switchLabel}`}
              aria-label={
                formData.type === "INCOME" ? "Switch to expense" : "Switch to income"
              }
            />

            <span className={formData.type === "EXPENSE" ? styles.expense : ""}>
              Expense
            </span>
          </div>

          {/* EXPENSE'te kategori seçimi */}
          {formData.type === "EXPENSE" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Select a category</label>
              <select
                className={styles.select}
                value={formData.category}
                onChange={(e) => setField("category", e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories
                  .filter((c) => c.type === "EXPENSE")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Amount + Date */}
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setField("amount", e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <input
                className={styles.input}
                type="date"
                value={formData.date}
                onChange={(e) => setField("date", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Comment */}
          <div className={styles.formGroup}>
            <input
              className={styles.input}
              type="text"
              placeholder="Comment"
              value={formData.comment}
              onChange={(e) => setField("comment", e.target.value)}
            />
          </div>

          {/* Buttons */}
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