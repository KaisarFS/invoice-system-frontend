import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoices, setPage } from '../store/invoiceSlice';
import {
  Pagination,
  PaginationItem,
  PaginationCursor,
  PaginationItemType,
} from '@nextui-org/pagination';
import { ChevronIcon } from '../components/icon/ChevronIcon';

const InvoiceList = () => {
  const dispatch = useDispatch();
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [openInvoiceId, setOpenInvoiceId] = useState(null);
  const { invoices, totalPages, currentPage, status, error } = useSelector(
    (state) => state.invoices
  );

  const limit = 10;

  const toggleOffcanvas = (invoiceId) => {
    setOpenInvoiceId(openInvoiceId === invoiceId ? null : invoiceId);
  };

  useEffect(() => {
    dispatch(fetchInvoices({ page: currentPage, limit }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button key={key} className={className} onClick={onNext}>
          <ChevronIcon className="rotate-180" />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button key={key} className={className} onClick={onPrevious}>
          <ChevronIcon />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button key={key} className={className}>
          ...
        </button>
      );
    }

    return (
      <button
        key={key}
        ref={ref}
        className={`${className} ${
          isActive
            ? 'text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold'
            : ''
        }`}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-24">
      <h2>Invoice List</h2>

      {status === 'loading' && <p>Loading invoices...</p>}
      {status === 'failed' && <p>Error: {error}</p>}

      {status === 'succeeded' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4 mt-5 sm:mt-10">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex flex-col bg-white border border-t-4 border-t-blue-600 shadow-sm rounded-xl"
              >
                <div className="border-b rounded-t-xl py-3 px-4 md:py-4 md:px-5">
                  <p className="mt-1 text-sm text-gray-500">
                    #INV-{invoice?.id}
                  </p>
                </div>
                <div className="bg-gray-100 border-b border-gray-200 text-sm text-gray-800 p-4">
                  <div className="grid grid-cols-2">
                    <div>
                      <div className="mb-2">
                        <p className="text-center">Customer</p>
                        <p className="text-center font-bold">
                          {invoice?.customerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-center">Sales</p>
                        <p className="text-center font-bold">
                          {invoice?.salespersonName}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2">
                        <p className="text-center">Total</p>
                        <p className="text-center font-bold">
                          $
                          {invoice?.products
                            .reduce((sum, product) => sum + product.price, 0)
                            .toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-center">Method</p>
                        <p className="text-center font-bold">
                          {invoice?.paymentType}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-5">
                  <p className=" text-gray-500">{invoice?.notes}</p>
                  <button
                    className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold rounded-lg border border-transparent text-blue-600 decoration-2 hover:text-blue-700 hover:underline focus:underline focus:outline-none focus:text-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => toggleOffcanvas(invoice?.id)}
                  >
                    Invoice detail
                    <svg
                      className="shrink-0 size-4"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>

                  {/* Offcanvas start */}
                  {openInvoiceId === invoice.id && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-[70]"
                      onClick={() => toggleOffcanvas(invoice?.id)}
                    ></div>
                  )}

                  <div
                    id={`hs-ai-offcanvas-${invoice?.id}`}
                    className={`hs-overlay fixed top-0 right-0 transition-all duration-300 overflow-y-scroll transform h-full max-w-md w-full z-[80] bg-white border-e [&::-webkit-scrollbar]:w-2
                      [&::-webkit-scrollbar-track]:rounded-full
                      [&::-webkit-scrollbar-track]:bg-gray-100
                      [&::-webkit-scrollbar-thumb]:rounded-full
                      [&::-webkit-scrollbar-thumb]:bg-gray-300
                      dark:[&::-webkit-scrollbar-track]:bg-neutral-100
                      dark:[&::-webkit-scrollbar-thumb]:bg-neutral-200 ${
                        openInvoiceId === invoice?.id ? 'translate-x-0' : 'translate-x-full'
                      }`}
                    role="dialog"
                    tabIndex="-1"
                    aria-labelledby={`hs-ai-offcanvas-label-${invoice?.id}`}
                  >
                    <div className="relative overflow-hidden min-h-32 text-center bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-center">
                      <div className="absolute top-2 end-2">
                        <button
                          type="button"
                          className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none"
                          aria-label="Close"
                          onClick={toggleOffcanvas}
                        >
                          <span className="sr-only">Close</span>
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </button>
                      </div>

                      <figure className="absolute inset-x-0 bottom-0 -mb-px">
                        <svg
                          preserveAspectRatio="none"
                          xmlns="http://www.w3.org/2000/svg"
                          x="0px"
                          y="0px"
                          viewBox="0 0 1920 100.1"
                        >
                          <path
                            fill="currentColor"
                            className="fill-white"
                            d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                          ></path>
                        </svg>
                      </figure>
                    </div>

                    <div className="relative z-10 -mt-12">
                      <span className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm">
                        <svg
                          className="size-6"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                          <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                        </svg>
                      </span>
                    </div>

                    <div className="p-4 sm:p-7 overflow-y-auto">
                      <div className="text-center">
                        <h3
                          id="hs-ai-offcanvas-label"
                          className="text-lg font-semibold text-gray-800"
                        >
                          Invoice from {invoice?.customerName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Invoice #INV-{invoice?.id}
                        </p>
                      </div>

                      <div className="mt-5 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <div>
                          <span className="block text-xs uppercase text-gray-500">
                            Amount paid:
                          </span>
                          <span className="block text-sm font-medium text-gray-800">
                            $
                            {invoice?.products
                              .reduce(
                                (total, product) => total + product.price,
                                0
                              )
                              .toFixed(2)}
                          </span>
                        </div>

                        <div>
                          <span className="block text-xs uppercase text-gray-500">
                            Date paid:
                          </span>
                          <span className="block text-sm font-medium text-gray-800">
                            April 22, 2020
                          </span>
                        </div>

                        <div>
                          <span className="block text-xs uppercase text-gray-500">
                            Payment method:
                          </span>
                          <div className="flex items-center gap-x-2">
                            <svg
                              className="size-5"
                              width="400"
                              height="248"
                              viewBox="0 0 400 248"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clipPath="url(#clip0)">
                                <path
                                  d="M254 220.8H146V26.4H254V220.8Z"
                                  fill="#FF5F00"
                                />
                                <path
                                  d="M152.8 123.6C152.8 84.2 171.2 49 200 26.4C178.2 9.2 151.4 0 123.6 0C55.4 0 0 55.4 0 123.6C0 191.8 55.4 247.2 123.6 247.2C151.4 247.2 178.2 238 200 220.8C171.2 198.2 152.8 163 152.8 123.6Z"
                                  fill="#EB001B"
                                />
                                <path
                                  d="M400 123.6C400 191.8 344.6 247.2 276.4 247.2C248.6 247.2 221.8 238 200 220.8C228.8 198.2 247.2 163 247.2 123.6C247.2 84.2 228.8 49 200 26.4C221.8 9.2 248.6 0 276.4 0C344.6 0 400 55.4 400 123.6Z"
                                  fill="#F79E1B"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <rect
                                    width="400"
                                    height="247.2"
                                    fill="white"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <span className="block text-sm font-medium text-gray-800">
                              •••• 4242
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-10">
                        <h4 className="text-xs font-semibold uppercase text-gray-800">
                          Summary
                        </h4>

                        <ul className="mt-3 flex flex-col">
                          <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
                            <div className="flex items-center justify-between w-full">
                              <span>Products</span>
                              <span>Total</span>
                            </div>
                          </li>
                          {invoice?.products.map((product) => (
                            <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
                              <div className="flex items-center justify-between w-full">
                                <span>{product?.name}</span>
                                <span>${product?.price.toFixed(2)}</span>
                              </div>
                            </li>
                          ))}
                          <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg">
                            <div className="flex items-center justify-between w-full">
                              <span>Amount paid</span>
                              <span>
                                $
                                {invoice?.products
                                  .reduce(
                                    (total, product) => total + product.price,
                                    0
                                  )
                                  .toFixed(2)}
                              </span>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="mt-5 flex justify-end gap-x-2">
                        <a
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50"
                          href="#"
                        >
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                          </svg>
                          Invoice PDF
                        </a>
                        <a
                          className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                          href="#"
                        >
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="6 9 6 2 18 2 18 9" />
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect width="12" height="8" x="6" y="14" />
                          </svg>
                          Print
                        </a>
                      </div>

                      <div className="mt-5 sm:mt-10">
                        <p className="text-sm text-gray-500 italic">
                          Notes: {invoice?.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Offcanvas end */}
                </div>
              </div>
            ))}

         
          </div>
          <Pagination
            disableCursorAnimation
            showControls
            radius="full"
            total={totalPages}
            initialPage={currentPage}
            onChange={handlePageChange}
            className="gap-2 mt-4"
            renderItem={renderItem}
            variant="light"
          />
        </>
      )}
    </div>
  );
};

export default InvoiceList;
