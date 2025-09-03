import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Monobank API'den döviz kurları çek
export const fetchCurrency = createAsyncThunk(
  "currency/fetchCurrency",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://api.monobank.ua/bank/currency");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const currencySlice = createSlice({
  name: "currency",
  initialState: {
    rates: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrency.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rates = action.payload;
      })
      .addCase(fetchCurrency.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default currencySlice.reducer;
