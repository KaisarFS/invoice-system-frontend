import React, { useState } from 'react';
import axios from 'axios';
import ProductAutocomplete from './ProductAutocomplete';
import { DatePicker } from '@nextui-org/date-picker';
import { Input, Textarea } from '@nextui-org/input';
import { Button } from '@nextui-org/button';
import { Avatar } from '@nextui-org/avatar';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { SearchIcon } from './icon/SearchIcon';

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
        products,
      });

      console.log(response, '<==== response handleSubmit');

      alert('Invoice created successfully');
    } catch (error) {
      alert('Error creating invoice');
    }
  };

  return (
    <>
      <div className="container mx-auto p-24">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Customer Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Salesperson Name:</label>
            <input
              type="text"
              value={salespersonName}
              onChange={(e) => setSalespersonName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Notes:</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <ProductAutocomplete
              products={products}
              setProducts={setProducts}
            />
          </div>
          <button type="submit">Create Invoice</button>
        </form>
      </div>

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

                <form>
                  <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
                    {/* Customer name start */}
                    <div className="sm:col-span-3">
                      <label
                        for="customer-name"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Customer name
                      </label>
                    </div>

                    <div className="sm:col-span-9">
                      <Input
                        id="customer-name"
                        type="text"
                        variant="bordered"
                        isInvalid={true}
                        placeholder="Jahn Daa"
                        errorMessage="Please enter customer name"
                        className="w-full"
                      />
                    </div>
                    {/* Customer name end */}

                    {/* Sales name start */}
                    <div className="sm:col-span-3">
                      <label
                        for="sales-name"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        John Doe
                      </label>
                    </div>

                    <div className="sm:col-span-9">
                      <Input
                        id="sales-name"
                        type="text"
                        variant="bordered"
                        isInvalid={true}
                        errorMessage="Please enter sales name"
                        className="w-full"
                      />
                    </div>
                    {/* Sales name end */}

                    {/* Date start */}
                    <div className="sm:col-span-3">
                      <label
                        for="sales-name"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Sales name
                      </label>
                    </div>

                    <div className="sm:col-span-9">
                      <DatePicker label="Bill date" className="max-w-[284px]" />
                    </div>
                    {/* Date end */}

                    {/* Autocomplete start */}
                    <div className="sm:col-span-3">
                      <label
                        for="sales-name"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Choose Product
                      </label>
                    </div>

                    <div className="sm:col-span-9">
                      <Autocomplete
                        classNames={{
                          base: 'max-w-xs',
                          listboxWrapper: 'max-h-[320px]',
                          selectorButton: 'text-default-500',
                        }}
                        defaultItems={products}
                        inputProps={{
                          classNames: {
                            input: 'ml-1',
                            inputWrapper: 'h-[48px]',
                          },
                        }}
                        listboxProps={{
                          hideSelectedIcon: true,
                          itemClasses: {
                            base: [
                              'rounded-medium',
                              'text-default-500',
                              'transition-opacity',
                              'data-[hover=true]:text-foreground',
                              'dark:data-[hover=true]:bg-default-50',
                              'data-[pressed=true]:opacity-70',
                              'data-[hover=true]:bg-default-200',
                              'data-[selectable=true]:focus:bg-default-100',
                              'data-[focus-visible=true]:ring-default-500',
                            ],
                          },
                        }}
                        aria-label="Select product"
                        placeholder="Enter product name"
                        popoverProps={{
                          offset: 10,
                          classNames: {
                            base: 'rounded-large',
                            content:
                              'p-1 border-small border-default-100 bg-background',
                          },
                        }}
                        startContent={
                          <SearchIcon
                            className="text-default-400"
                            strokeWidth={2.5}
                            size={20}
                          />
                        }
                        radius="full"
                        variant="bordered"
                      >
                        {(item) => (
                          <AutocompleteItem key={item.id} textValue={item.name}>
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2 items-center">
                                <Avatar
                                  alt={item.name}
                                  className="flex-shrink-0"
                                  size="sm"
                                  src={item.picture}
                                />
                                <div className="flex flex-col">
                                  <span className="text-small">
                                    WOW
                                  </span>
                                  <span className="text-tiny text-default-400">
                                    ITEM TEAM/S
                                  </span>
                                </div>
                              </div>
                              <Button
                                className="border-small mr-0.5 font-medium shadow-small"
                                radius="full"
                                size="sm"
                                variant="bordered"
                              >
                                Add
                              </Button>
                            </div>
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    </div>
                    {/* Autocomplete end */}

                    {/* Notes start */}
                    <div className="sm:col-span-3">
                      <label
                        for="notes"
                        className="inline-block text-sm text-gray-800 mt-2.5"
                      >
                        Notes <span className="italic">(Optional)</span>
                      </label>
                    </div>

                    <div className="sm:col-span-9">
                      <Textarea
                        key="bordered"
                        variant="bordered"
                        label="Description"
                        labelPlacement="outside"
                        placeholder="Enter your description"
                        className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                      />
                    </div>
                    {/* Notes end */}
                  </div>

                  <div className="mt-5 flex justify-end gap-x-2">
                    <button
                      type="button"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Create
                    </button>
                  </div>
                </form>
                <div className="absolute bottom-12 -start-20 -z-[1] size-48 bg-gradient-to-b from-orange-500 to-white p-px rounded-lg dark:to-neutral-900">
                  <div className="bg-white size-48 rounded-lg dark:bg-neutral-900"></div>
                </div>

                <div className="absolute -top-12 -end-20 -z-[1] size-48 bg-gradient-to-t from-blue-600 to-cyan-400 p-px rounded-full">
                  <div className="bg-white size-48 rounded-full dark:bg-neutral-900"></div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-12 -start-20 -z-[1] size-48 bg-gradient-to-b from-orange-500 to-white p-px rounded-lg">
              <div className="bg-white size-48 rounded-lg"></div>
            </div>

            <div className="absolute -top-12 -end-20 -z-[1] size-48 bg-gradient-to-t from-blue-600 to-cyan-400 p-px rounded-full">
              <div className="bg-white size-48 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceForm;
