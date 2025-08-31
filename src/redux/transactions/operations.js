import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://wallet.b.goit.study/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);


export const getTransactions = createAsyncThunk(
    'transactions/getTransactions',
    async () => {
        const [transactionsRes, categoriesRes] = await Promise.all([
            api.get('/transactions'),
            api.get('/transaction-categories')
        ]);
        return { transactions: transactionsRes.data, transactionCategories: categoriesRes.data };
    }
);

// ADD 
export const addTransaction = createAsyncThunk(
    'transactions/addTransaction',
    async (transaction) => {
        const response = await api.post('/transactions', transaction);
        return response.data;
    }
);

// EDIT 
export const editTransaction = createAsyncThunk(
    'transactions/editTransaction',
    async ({ id, updates }) => {
        const response = await api.patch(`/transactions/${id}`, updates);
        return response.data;
    }
);

// DELETE
export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async (id) => {
        await api.delete(`/transactions/${id}`);
        return id;
    }
);
