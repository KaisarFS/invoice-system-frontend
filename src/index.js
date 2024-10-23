import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import reportWebVitals from './reportWebVitals';

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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>,
  </React.StrictMode>
);

reportWebVitals();
