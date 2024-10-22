import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchProductSuggestions = createAsyncThunk(
  'products/fetchSuggestions',
  async (query) => {
    const response = await axios.get(`http://localhost:3000/api/products?query=${query}`);
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    suggestions: [],
    selectedProducts: [],
    noResults: false,
    status: 'idle', // idle | loading | succeeded | failed
  },
  reducers: {
    addProduct: (state, action) => {
      state.selectedProducts.push(action.payload);
    },
    resetSuggestions: (state) => {
      state.suggestions = [];
      state.noResults = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductSuggestions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.status = 'succeeded';
        state.noResults = action.payload.length === 0;
      })
      .addCase(fetchProductSuggestions.rejected, (state) => {
        state.status = 'failed';
        state.noResults = true;
      });
  },
});

export const { addProduct, resetSuggestions } = productSlice.actions;

export default productSlice.reducer;
