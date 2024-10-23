import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductSuggestions,
  resetSuggestions,
} from '../store/productSlice';
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { Button } from '@nextui-org/button';
import { Avatar } from '@nextui-org/avatar';
import { SearchIcon } from './icon/SearchIcon';

const ProductAutocomplete = ({ products, setProducts }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const { suggestions, status } = useSelector((state) => state.products);

  const handleSearch = useCallback(
    (e) => {
      const value = e.target.value;
      setQuery(value);
      if (value.length > 1) {
        dispatch(fetchProductSuggestions(value));
      } else {
        dispatch(resetSuggestions());
      }
    },
    [dispatch]
  );

  const handleAddProduct = useCallback(
    (product) => {
      if (!products.includes(product.id)) {
        setSelectedProducts((prevProducts) => [...prevProducts, product]);
        setProducts((prevProducts) => [...prevProducts, product.id]);
      }
      setQuery('');
      dispatch(resetSuggestions());
    },
    [products, setProducts, dispatch]
  );

  return (
    <>
      <Autocomplete
        classNames={{
          base: 'max-w-xs',
          listboxWrapper: 'max-h-[320px]',
          selectorButton: 'text-default-500',
        }}
        defaultItems={suggestions}
        inputProps={{
          value: query,
          onChange: handleSearch,
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
            content: 'p-1 border-small border-default-100 bg-background',
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
                  <span className="text-small">{item.name}</span>
                  <span className="text-tiny text-default-400">
                    ${item.price}
                  </span>
                </div>
              </div>
              <Button
                className="border-small mr-0.5 font-medium shadow-small"
                radius="full"
                size="sm"
                variant="bordered"
                onClick={() => handleAddProduct(item)}
              >
                Add
              </Button>
            </div>
          </AutocompleteItem>
        )}
      </Autocomplete>

      <div>
        <h3>Selected Products</h3>
        <ul>
          {selectedProducts.map((product, index) => (
            <li key={index}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProductAutocomplete;
