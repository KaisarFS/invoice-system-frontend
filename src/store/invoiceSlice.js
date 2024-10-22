import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch paginated invoices
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async ({ page, limit }) => {
    const response = await axios.get(`http://localhost:3000/api/invoices?limit=${limit}&offset=${(page - 1) * limit}`);
    return response.data;
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    totalInvoices: 0,
    totalPages: 0,
    currentPage: 1,
    status: 'idle', // idle | loading | succeeded | failed
    error: null
  },
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.invoices = action.payload.invoices;
        state.totalInvoices = action.payload.totalInvoices;
        state.totalPages = action.payload.totalPages;
        state.status = 'succeeded';
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setPage } = invoiceSlice.actions;

export default invoiceSlice.reducer;
