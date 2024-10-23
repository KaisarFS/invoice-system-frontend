import React, { useState } from 'react';
import axios from 'axios';
import ProductAutocomplete from './ProductAutocomplete';
import { DatePicker } from '@nextui-org/date-picker';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { parseDate } from '@internationalized/date';
import { today } from '@internationalized/date';


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

const InvoiceForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [salespersonName, setSalespersonName] = useState('');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState([]);
  const [date, setDate] = useState(today()); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;

    try {
        const response = await axios.post('http://localhost:3000/api/invoices', {
            date: formattedDate, 
            customerName,
            salespersonName,
            notes,
            paymentType: 'Cash',
            products
        });

        // To cut time, I jus tuse alert here, I'm so sorry.
        alert('Invoice created successfully');
    } catch (error) {
        console.error('Error creating invoice:',error);
        alert('Error creating invoice');
    }
};

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl text-center mx-auto">
            <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl">
              Designed for you to get more{' '}
              <span className="text-blue-600">simple</span>
            </h1>
            <p className="mt-3 text-lg text-gray-800">
              Build your business here. Take it anywhere.
            </p>
          </div>

          <div className="mt-10 relative max-w-5xl mx-auto">
            <div className="max-w-4xl px-4 py-10 sm:px-6 lg:px-8 mx-auto">
              <div className="bg-white rounded-xl shadow p-4 sm:p-7">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800">
                    New Invoice
                  </h2>
                  <p className="text-sm text-gray-600">
                    Create a new invoice for your customers
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                    {/* Customer Name */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="customer-name"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Customer Name
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <Input
                        id="customer-name"
                        type="text"
                        variant="bordered"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="John Doe"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Salesperson Name */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="salesperson-name"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Salesperson Name
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <Input
                        id="salesperson-name"
                        type="text"
                        variant="bordered"
                        value={salespersonName}
                        onChange={(e) => setSalespersonName(e.target.value)}
                        placeholder="Jane Smith"
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Date Picker */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="bill-date"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Bill Date
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <DatePicker
                        label="Select Date"
                        value={date} // Ensure date is a CalendarDate or ZonedDateTime object
                        onChange={(selectedDate) => setDate(selectedDate)}
                        className="max-w-[284px]"
                        required
                      />
                    </div>

                    {/* Product Autocomplete */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="product-autocomplete"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Choose Product
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <ProductAutocomplete
                        products={products}
                        setProducts={setProducts} // Update product selection
                      />
                    </div>

                    {/* Notes */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="notes"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Notes (Optional)
                      </label>
                    </div>
                    <div className="sm:col-span-9">
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter any additional notes..."
                        className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                      />
                    </div>
                  </div>

                  {/* Submit and Cancel Buttons */}
                  <div className="mt-5 flex justify-end gap-x-2">
                    <Button
                      type="button"
                      className="py-2 px-3 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="py-2 px-3 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Create
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceForm;
