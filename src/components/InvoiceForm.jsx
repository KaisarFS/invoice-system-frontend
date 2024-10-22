import React, { useState } from 'react';
import axios from 'axios';
import ProductAutocomplete from './ProductAutocomplete';

const InvoiceForm = () => {
  const [date, setDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [salespersonName, setSalespersonName] = useState('');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/api/invoices', {
        date,
        customerName,
        salespersonName,
        notes,
        products
      });

      console.log(response, '<==== response handleSubmit')

      alert('Invoice created successfully');
    } catch (error) {
      alert('Error creating invoice');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Date:</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>
      <div>
        <label>Customer Name:</label>
        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
      </div>
      <div>
        <label>Salesperson Name:</label>
        <input type="text" value={salespersonName} onChange={(e) => setSalespersonName(e.target.value)} required />
      </div>
      <div>
        <label>Notes:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <div>
        <ProductAutocomplete products={products} setProducts={setProducts} />
      </div>
      <button type="submit">Create Invoice</button>
    </form>
  );
};

export default InvoiceForm;
