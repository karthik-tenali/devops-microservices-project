import React from 'react';
import EntityList from './EntityList';

const productFields = [
  { name: 'id', label: 'ID', type: 'number' },
  { name: 'name', label: 'Name' },
  { name: 'price', label: 'Price', type: 'number', step: '0.01' },
];

function ProductList(props) {
  return <EntityList {...props} apiBaseUrl="http://localhost:3001/products" fields={productFields} title="Product" />;
}

export default ProductList;

