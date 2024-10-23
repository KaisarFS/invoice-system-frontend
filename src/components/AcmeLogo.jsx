import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductSuggestions, resetSuggestions } from '../store/productSlice';

const ProductAutocomplete = ({ products, setProducts }) => { 
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { suggestions, noResults, status } = useSelector((state) => state.products);

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      dispatch(fetchProductSuggestions(value));
    } else {
      dispatch(resetSuggestions());
    }
  };

  const handleAddProduct = (product) => {
    if (!products.includes(product.id)) {
      setProducts([...products, product.id])
    }
    setQuery('');
    dispatch(resetSuggestions());
  };

  return (
    <div>
      <label>Products:</label>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search for products..."
      />
      <ul>
        {status === 'loading' && <li>Loading...</li>}
        {noResults && <li>No products found matching your search.</li>}
        {suggestions.map((product) => (
          <li key={product.id} onClick={() => handleAddProduct(product)}>
            {product.name} (${product.price})
          </li>
        ))}
      </ul>

      <div>
        <h3>Selected Products</h3>
        <ul>
          {products.map((productId, index) => (
            <li key={index}>Product ID: {productId}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductAutocomplete;
