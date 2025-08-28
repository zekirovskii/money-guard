import { createAsyncThunk } from '@reduxjs/toolkit';
import { loginStart, loginSuccess, loginFailure, registerStart, registerSuccess, registerFailure, clearError, logout } from './slice.js';

// LocalStorage'dan kullanıcıları al
const getRegisteredUsers = () => {
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

// LocalStorage'a kullanıcıları kaydet
const saveRegisteredUsers = (users) => {
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

// Kullanıcı girişi
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch }) => {
    try {
      dispatch(loginStart());
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const registeredUsers = getRegisteredUsers();
      const user = registeredUsers.find(u => 
        u.email === credentials.email && u.password === credentials.password
      );
      
      if (user) {
        const response = {
          user: { id: user.id, name: user.name, email: user.email },
          token: 'user-token-' + user.id
        };
        
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        dispatch(loginSuccess(response));
        return response;
      } else {
        throw new Error('Geçersiz email veya şifre');
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      throw error;
    }
  }
);

// Kullanıcı kaydı
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { dispatch }) => {
    try {
      dispatch(registerStart());
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const registeredUsers = getRegisteredUsers();
      
      // Email kontrolü
      const existingUser = registeredUsers.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('Bu email adresi zaten kayıtlı');
      }
      
      // Yeni kullanıcı oluştur
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        password: userData.password
      };
      
      // Kullanıcıyı kaydet
      registeredUsers.push(newUser);
      saveRegisteredUsers(registeredUsers);
      
      const response = {
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
        token: 'user-token-' + newUser.id
      };
      
      // Token'ı localStorage'a kaydet
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch(registerSuccess(response));
      return response;
    } catch (error) {
      dispatch(registerFailure(error.message));
      throw error;
    }
  }
);

// Kullanıcı çıkışı
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      // LocalStorage'dan kullanıcı verilerini temizle
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      dispatch(logout());
    } catch (error) {
      console.error('Logout error:', error);
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
        const userData = JSON.parse(user);
        const response = {
          user: userData,
          token: token
        };
        dispatch(loginSuccess(response));
        return response;
      }
    } catch (error) {
      console.error('Auth check error:', error);
    }
  }
);

// Export clearError from slice
export { clearError };
