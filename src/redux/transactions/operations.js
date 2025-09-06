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
    async (transaction, { rejectWithValue }) => {
        try {
            // Validation
            if (!transaction.transactionDate || !transaction.type || !transaction.categoryId || !transaction.amount) {
                return rejectWithValue('Tüm alanlar zorunludur');
            }
            
            if (!['INCOME', 'EXPENSE'].includes(transaction.type)) {
                return rejectWithValue('Geçersiz transaction tipi');
            }
            
            const response = await api.post('/transactions', transaction);
            return response.data;
        } catch (error) {
            console.error('API Error Details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.response?.data?.message,
                fullError: error
            });
            
            if (error.response?.status === 409) {
                return rejectWithValue('Kategori tipi transaction tipi ile uyuşmuyor');
            } else if (error.response?.status === 404) {
                return rejectWithValue('Kategori bulunamadı');
            } else if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || 'Geçersiz veri formatı';
                return rejectWithValue(`400 Hatası: ${errorMessage}`);
            } else {
                return rejectWithValue(error.response?.data?.message || 'Transaction eklenirken hata oluştu');
            }
        }
    }
);

// EDIT işlemini iyileştir
export const editTransaction = createAsyncThunk(
    'transactions/editTransaction',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            // Validation ekle
            if (updates.type && !['INCOME', 'EXPENSE'].includes(updates.type)) {
                return rejectWithValue('Geçersiz transaction tipi');
            }
            
            // Amount validation'ını kaldır - backend'e gönderilen amount zaten doğru işarete sahip
            // if (updates.amount && updates.amount <= 0) {
            //     return rejectWithValue('Miktar 0\'dan büyük olmalıdır');
            // }

            const response = await api.patch(`/transactions/${id}`, updates);
            return response.data;
        } catch (error) {
            console.error('Edit transaction error:', error);
            
            if (error.response?.status === 403) {
                return rejectWithValue('Bu transaction\'ı düzenleme yetkiniz yok');
            } else if (error.response?.status === 404) {
                return rejectWithValue('Transaction veya kategori bulunamadı');
            } else if (error.response?.status === 409) {
                return rejectWithValue('Kategori tipi transaction tipi ile uyuşmuyor');
            } else if (error.response?.status === 400) {
                const errorMessage = error.response?.data?.message || 'Geçersiz veri formatı';
                return rejectWithValue(`400 Hatası: ${errorMessage}`);
            } else {
                return rejectWithValue(error.response?.data?.message || 'Transaction güncellenirken hata oluştu');
            }
        }
    }
);

// DELETE
export const deleteTransaction = createAsyncThunk(
    'transactions/deleteTransaction',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/transactions/${id}`);
            return id;
        } catch (error) {
            if (error.response?.status === 403) {
                return rejectWithValue('Bu transaction\'ı silme yetkiniz yok');
            } else if (error.response?.status === 404) {
                return rejectWithValue('Transaction bulunamadı');
            } else if (error.response?.status === 401) {
                return rejectWithValue('Oturum süreniz dolmuş, lütfen tekrar giriş yapın');
            } else {
                return rejectWithValue(error.response?.data?.message || 'Transaction silinirken hata oluştu');
            }
        }
    }
);
