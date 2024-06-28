import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ProductDetails.css'; // Import the CSS file
import { useDispatch } from 'react-redux';
import { addToCart } from '../../pages/Shop/redux/orebiSlice'; // Adjust the import path
import { toast } from 'react-toastify';
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer';
import axios from 'axios';

const ProductDetails = () => {
  const location = useLocation();
  const product = location.state;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReviews = async () => {
      if (product) {
        try {
          const response = await axios.get(`https://api.baazaarplus.xyz/api/ratings/rating/product/${product.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setReviews(response.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api.baazaarplus.xyz/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchReviews();
    fetchUsers();
  }, [product]);

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

  const getUserNameById = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.username : 'Unknown User';
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
          <div className="reviews">
            <h2>Reviews:</h2>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review">
                  <p><strong>{getUserNameById(review.userId)}</strong></p>
                  <p>Rating: {review.rating}</p>
                  <p>{review.review}</p>
                </div>
              ))
            ) : (
              <p>No reviews available for this product.</p>
            )}
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
