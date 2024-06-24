import React from 'react';
import styled from 'styled-components';
import ProductCard from './ProductCard'; // Correct import of the ProductCard component

const ProductListWrapper = styled.section`
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
`;

const ProductList = () => {
  const products = [
    { id: 1, image: 'https://via.placeholder.com/200', title: 'Product 1', description: 'Description 1', price: 29.99 },
    { id: 2, image: 'https://via.placeholder.com/200', title: 'Product 2', description: 'Description 2', price: 39.99 },
    { id: 3, image: 'https://via.placeholder.com/200', title: 'Product 3', description: 'Description 3', price: 19.99 },
    { id: 4, image: 'https://via.placeholder.com/200', title: 'Product 4', description: 'Description 4', price: 49.99 },
  ];

  return (
    <ProductListWrapper>
      {products.map(product => (
        <ProductCard key={product.id} {...product} />
      ))}
    </ProductListWrapper>
  );
};

export default ProductList;
