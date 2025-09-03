import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk: seçilen ay/yıl için işlem istatistiklerini getir
export const fetchStatistics = createAsyncThunk(
  "statistics/fetchStatistics",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/statistics?month=${month}&year=${year}`
      );
      return response.data; // backend JSON dönecek
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    data: null, // Chart + Table için veriler
    status: "idle",
    error: null,
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
  },
  reducers: {
    setMonth(state, action) {
      state.selectedMonth = action.payload;
    },
    setYear(state, action) {
      state.selectedYear = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setMonth, setYear } = statisticsSlice.actions;
export default statisticsSlice.reducer;
