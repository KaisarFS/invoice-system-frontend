import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InvoiceList from './pages/InvoiceListPage';
import InvoiceForm from './components/InvoiceForm';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RevenueChart from './components/RevenueChart';

const resizeObserverErrorPatch = () => {
  const observer = new ResizeObserver(() => {});
  observer.observe(document.body);
};

resizeObserverErrorPatch();


if (typeof window !== "undefined") {
  const observerErr = window.onerror;

  window.onerror = (message, source, lineno, colno, error) => {
    if (message.includes('ResizeObserver')) {
      return true;
    }
    if (observerErr) {
      return observerErr(message, source, lineno, colno, error);
    }
  };
}
function App() {

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/add-invoice" element={<InvoiceForm />} />
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<>
            <HomePage />
            <RevenueChart />
          </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
