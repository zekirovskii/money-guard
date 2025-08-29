import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, clearError, logout } from './slice.js';

// API base URL
const API_BASE_URL = 'https://wallet.b.goit.study/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Kullanıcı girişi
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch }) => {
    try {
      dispatch(loginStart());
      
      const response = await api.post('/auth/sign-in', {
        email: credentials.email,
        password: credentials.password,
      });
      
      const { token, user } = response.data;
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(loginSuccess({ user, token }));
      return { user, token };
    } catch (error) {
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      
      if (error.response?.status === 403) {
        errorMessage = 'Şifre yanlış';
      } else if (error.response?.status === 404) {
        errorMessage = 'Bu email adresi ile kayıtlı kullanıcı bulunamadı';
      } else if (error.response?.status === 400) {
        errorMessage = 'Geçersiz email veya şifre formatı';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);

// Kullanıcı kaydı
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch }) => {
    try {
      dispatch(registerStart());
      
      const response = await api.post('/auth/sign-up', {
        username: userData.name, // Backend username bekliyor, name değil
        email: userData.email,
        password: userData.password,
      });
      
      const { token, user } = response.data;
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(registerSuccess({ user, token }));
      return { user, token };
    } catch (error) {
      let errorMessage = 'Kayıt olurken bir hata oluştu';
      
      if (error.response?.status === 409) {
        errorMessage = 'Bu email adresi zaten kayıtlı';
      } else if (error.response?.status === 400) {
        errorMessage = 'Geçersiz bilgi formatı';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      dispatch(registerFailure(errorMessage));
      throw new Error(errorMessage);
    }
  }
);

// Kullanıcı çıkışı
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      // Backend'e logout isteği gönder (DELETE method)
      await api.delete('/auth/sign-out');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // LocalStorage'dan kullanıcı verilerini temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
    }
  }
);

// Kullanıcı bilgilerini getir
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { dispatch }) => {
    try {
      const response = await api.get('/users/current');
      const user = response.data;
      
      // Kullanıcı bilgilerini güncelle
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  }
);

// Sayfa yenilendiğinde kullanıcı oturumunu kontrol et
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        // Token'ın geçerliliğini kontrol et
        const userData = JSON.parse(user);
        dispatch(loginSuccess({ user: userData, token }));
        
        // Güncel kullanıcı bilgilerini al
        try {
          await dispatch(getCurrentUser());
        } catch (error) {
          // Eğer token geçersizse logout yap
          dispatch(logoutUser());
        }
        
        return { user: userData, token };
      }
    } catch (error) {
      console.error('Auth check error:', error);
      dispatch(logoutUser());
    }
  }
);

// Export clearError from slice
export { clearError };
