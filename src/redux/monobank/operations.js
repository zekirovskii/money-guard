import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'https://api.monobank.ua';

// Döviz kuru verilerini localStorage'dan al
const getCurrencyFromStorage = () => {
  try {
    const stored = localStorage.getItem('monobankCurrencyData');
    if (stored) {
      const data = JSON.parse(stored);
      const now = new Date().getTime();
      const storedTime = new Date(data.timestamp).getTime();
      const diffHours = (now - storedTime) / (1000 * 60 * 60);
      
      // 1 saatten az ise localStorage'dan al
      if (diffHours < 1) {
        return data.currencies;
      }
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  return null;
};

// Döviz kuru verilerini localStorage'a kaydet
const saveCurrencyToStorage = (currencies) => {
  try {
    const data = {
      currencies,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('monobankCurrencyData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Döviz kodlarını sembollere çevir
const getCurrencySymbol = (code) => {
  const symbols = {
    840: 'USD',
    978: 'EUR',
    980: 'UAH'
  };
  return symbols[code] || code;
};

// Döviz kurlarını getir
export const fetchCurrencyRates = createAsyncThunk(
  'monobank/fetchRates',
  async (_, { rejectWithValue }) => {
    try {
      // Önce localStorage'dan kontrol et
      const cachedData = getCurrencyFromStorage();
      if (cachedData) {
        return cachedData;
      }

      // API'den yeni veri al
      const response = await axios.get(`${API_BASE_URL}/bank/currency`);
      
      // Sadece USD ve EUR kurlarını filtrele
      const filteredCurrencies = response.data
        .filter(item => 
          (item.currencyCodeA === 840 && item.currencyCodeB === 980) || // USD
          (item.currencyCodeA === 978 && item.currencyCodeB === 980)    // EUR
        )
        .map(item => ({
          currency: getCurrencySymbol(item.currencyCodeA),
          purchase: item.rateBuy?.toFixed(2) || item.rateCross?.toFixed(2),
          sale: item.rateSell?.toFixed(2) || item.rateCross?.toFixed(2),
          code: item.currencyCodeA
        }));

      // localStorage'a kaydet
      saveCurrencyToStorage(filteredCurrencies);
      
      return filteredCurrencies;
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      return rejectWithValue('Döviz kurları alınamadı');
    }
  }
);