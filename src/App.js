import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvoiceList from './components/InvoiceList';
import InvoiceForm from './components/InvoiceForm';

function App() {
  return (
    <Router>
      <div>
        <h1>Invoice System</h1>
        <nav>
          <ul>
            <li>
              <Link to="/add-invoice">Add Invoice</Link>
            </li>
            <li>
              <Link to="/invoices">View Invoices</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/add-invoice" element={<InvoiceForm />} />
          <Route path="/" element={<>
            <h2>Welcome to the Invoice System</h2>
            <p>Select a page from the navigation</p>
          </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
