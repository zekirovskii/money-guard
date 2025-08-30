import { createSelector } from '@reduxjs/toolkit';

const selectTransactionsState = (state) => state.transactions;

export const selectTransactions = (state) => selectTransactionsState(state).transactions;
export const selectTransactionCategories = (state) => selectTransactionsState(state).transactionCategories;
export const selectIsLoading = (state) => selectTransactionsState(state).isLoading;
export const selectError = (state) => selectTransactionsState(state).error;

export const selectTotalBalance = createSelector(
    [selectTransactions],
    (transactions) => transactions.reduce((sum, t) => {
        const amount = Number(t.amount || t.sum || 0);
        return t.type === 'INCOME' ? sum + amount : sum - amount;
    }, 0)
);
