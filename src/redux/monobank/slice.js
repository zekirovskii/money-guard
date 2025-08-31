import { createSlice } from '@reduxjs/toolkit';
import { fetchCurrencyRates } from './operations';

const monobankSlice = createSlice({
  name: 'monobank',
  initialState: {
    currencies: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrencyRates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrencyRates.fulfilled, (state, action) => {
        state.loading = false;
        state.currencies = action.payload;
      })
      .addCase(fetchCurrencyRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = monobankSlice.actions;
export default monobankSlice.reducer;