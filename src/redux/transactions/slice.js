import { createSlice } from '@reduxjs/toolkit';
import { getTransactions, addTransaction, editTransaction, deleteTransaction } from './operations';

const initialState = {
    transactions: [],
    transactionCategories: [],
    isLoading: false,
    error: null,
};

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            // GET
            .addCase(getTransactions.pending, state => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload.transactions;
                state.transactionCategories = action.payload.transactionCategories;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // ADD
            .addCase(addTransaction.pending, state => { state.isLoading = true; state.error = null; })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions.push(action.payload);
            })
            .addCase(addTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            // EDIT
            .addCase(editTransaction.fulfilled, (state, action) => {
                const index = state.transactions.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.transactions[index] = action.payload;
            })

            // DELETE
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions = state.transactions.filter(t => t.id !== action.payload);
            });
    }
});

export default transactionsSlice.reducer;
