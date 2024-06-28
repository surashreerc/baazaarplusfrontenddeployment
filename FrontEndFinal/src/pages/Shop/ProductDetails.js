import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductDetails.css'; // Import the CSS file
import { useDispatch } from 'react-redux';
import { addToCart } from '../../pages/Shop/redux/orebiSlice'; // Adjust the import path
import { toast } from 'react-toastify';
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer';

const ProductDetails = () => {
  const location = useLocation();
  const product = location.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleBack = () => {
    navigate('/shop');
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success('Product added to cart!');
  };

  return (
    <div>
      <Header />
    <div className="product-details-container">
      <div className="product-details-info">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="price">Price: ₹{product.price.toFixed(2)}</p>
        <p className="rating">Rating: {product.averageRating}</p>
        <p>Category: {product.category_name}</p>
        <div className="buttons">
          <button className="back-button" onClick={handleBack}>Back</button>
          <button className="cart-button" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
      <div className="product-details-image">
        <img src={product.image} alt={product.name} />
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default ProductDetails;
