import React from 'react';
import './ProductCard.css';

const ProductCard = ({ name, color, rating }) => {
  return (
    <div className="product-card">
      <img src="product-image.jpg" alt={name} />
      <h3>{name}</h3>
      <p>{color}</p>
      <p>Rating: {rating}</p>
    </div>
  );
};

export default ProductCard;
