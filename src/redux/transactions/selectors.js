import { createSelector } from '@reduxjs/toolkit';

const selectTransactionsState = (state) => state.transactions;

export const selectTransactions = (state) => selectTransactionsState(state).transactions;
export const selectTransactionCategories = (state) => selectTransactionsState(state).transactionCategories;
export const selectIsLoading = (state) => selectTransactionsState(state).isLoading;
export const selectError = (state) => selectTransactionsState(state).error;

// Ana balance - debug balance'ı kullan (çalışan versiyon)
export const selectTotalBalance = createSelector(
    [selectTransactions],
    (transactions) => {
        if (!transactions || transactions.length === 0) return 0;
        
        let balance = 0;
        
        // Transaction'ları tarihe göre sırala (eskiden yeniye)
        const sortedTransactions = [...transactions]
            .sort((a, b) => new Date(a.transactionDate) - new Date(b.transactionDate));
        
        // Her transaction'ı sırayla ekle/çıkar
        for (const transaction of sortedTransactions) {
            const amount = Number(transaction.amount || 0);
            balance += amount; // amount zaten doğru işarete sahip (EXPENSE negatif, INCOME pozitif)
        }
        
        return balance;
    }
);

// Eski balanceAfter versiyonu (artık kullanılmıyor)
export const selectBalanceAfter = createSelector(
    [selectTransactions],
    (transactions) => {
        if (!transactions || transactions.length === 0) return 0;
        
        // En son transaction'ın balanceAfter değerini kullan
        const sortedTransactions = [...transactions]
            .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
        
        const lastTransaction = sortedTransactions[0];
        return lastTransaction ? Number(lastTransaction.balanceAfter || 0) : 0;
    }
);

// Debug için tüm transaction'ları logla
export const selectDebugTransactions = createSelector(
    [selectTransactions],
    (transactions) => {
        if (transactions && transactions.length > 0) {
            console.log('All transactions for debugging:', transactions);
        }
        return transactions;
    }
);
