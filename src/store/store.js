import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';
import invoiceReducer from './invoiceSlice';  // Import the new reducer

export const store = configureStore({
  reducer: {
    products: productReducer,
    invoices: invoiceReducer, 
  },
});
