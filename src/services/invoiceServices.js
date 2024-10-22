import axios from 'axios';

export const createInvoice = async (invoiceData) => {
  console.log(invoiceData, '<=== invoiceData')
  return await axios.post('http://localhost:3000/api/invoices', invoiceData);
};

export const getInvoices = async (limit, offset) => {
  return await axios.get(`http://localhost:3000/api/invoices?limit=${limit}&offset=${offset}`);
};

export const getProducts = async (query) => {
  return await axios.get(`http://localhost:3000/api/products?query=${query}`);
};
