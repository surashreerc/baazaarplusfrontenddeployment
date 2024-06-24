import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import "./myOrder.css";
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer';

const MyOrder = () => {
  const { userEmail } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [productImages, setProductImages] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratingForm, setRatingForm] = useState({ userId: 0, productId: 0, rating: 0.0, review: '' });
  const [ratedOrders, setRatedOrders] = useState(new Set());
  const [ratingDataLoaded, setRatingDataLoaded] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await axios.get('http://localhost:8087/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        return userResponse.data.find(user => user.email === userEmail);
      } catch (err) {
        setError('Failed to fetch user data. Please try again later.');
        console.error('Error fetching user:', err);
        return null;
      }
    };

    const fetchUserOrders = async (userId) => {
      try {
        const orderResponse = await axios.get(`http://localhost:8081/api/orders`, {
          headers: { Authorization: `Bearer ${token}`, 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;charset=UTF-8' }
        });
        const userOrders = orderResponse.data.filter(order => order.customerId === userId);

        // Sort orders by order date in descending order
        const sortedOrders = userOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);

        const productIds = userOrders.flatMap(order => order.items.map(item => item.productId));
        await fetchProductImages(productIds);
        setRatingForm(prev => ({ ...prev, userId: userId }));

        // Fetch ratings to determine which orders have been rated
        const ratedOrdersResponse = await axios.get(`http://localhost:8092/api/ratings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ratedProductIds = new Set(ratedOrdersResponse.data.map(rating => rating.productId));
        setRatedOrders(ratedProductIds);
        setRatingDataLoaded(true);
      } catch (err) {
        setError('Failed to fetch orders. Please try again later.');
        console.error('Error fetching orders:', err);
      }
    };

    const fetchProductImages = async (productIds) => {
      try {
        const imageRequests = productIds.map(async productId => {
          const productResponse = await axios.get(`http://localhost:8085/api/products/product/${productId}`);
          return { productId, imageUrl: productResponse.data.image };
        });
        const images = await Promise.all(imageRequests);
        const imageMap = images.reduce((acc, { productId, imageUrl }) => {
          acc[productId] = imageUrl;
          return acc;
        }, {});
        setProductImages(imageMap);
      } catch (err) {
        console.error('Error fetching product images:', err);
      }
    };

    const initializeOrderProcess = async () => {
      const user = await fetchUser();
      if (user) {
        await fetchUserOrders(user.id);
      }
    };

    initializeOrderProcess();
  }, [userEmail]);

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingForm(prev => ({ ...prev, [name]: value }));
  };

  const submitRating = async (e) => {
    e.preventDefault();
    try {
      const ratingData = {
        userId: ratingForm.userId,
        productId: ratingForm.productId,
        rating: ratingForm.rating,
        review: ratingForm.review
      };

      // Check if the order has already been rated by the logged-in user
      const hasRated = ratedOrders.has(ratingForm.productId);

      if (hasRated) {
        // Update rating if already rated
        await axios.put('http://localhost:8092/api/ratings/rating/updateRating', ratingData, {
          headers: { Authorization: `Bearer ${token}`, 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;charset=UTF-8' }
        });
        alert('Rating updated successfully!');
      } else {
        // Add new rating if not rated before
        await axios.post('http://localhost:8092/api/ratings/rating/addRating', ratingData, {
          headers: { Authorization: `Bearer ${token}`, 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;charset=UTF-8' }
        });
        alert('Thank you for your rating! We appreciate it.');
      }

      // Update rated orders state
      setRatedOrders(prev => new Set(prev.add(ratingForm.productId)));
      setSelectedOrder(null);
    } catch (err) {
      setError('Failed to submit rating. Please try again later.');
      console.error('Error submitting rating:', err);
    }
  };

  const showRatingFormForOrder = async (orderId) => {
    setSelectedOrder(orderId);
    // Check if the logged-in user has already rated any of the products associated with the selected order
    const order = orders.find(order => order.id === orderId);
    const unratedItems = order.items.filter(item => !ratedOrders.has(item.productId));
    
    try {
      // Fetch ratings by user ID to determine if the user has already rated the product
      const ratedOrdersResponse = await axios.get(`http://localhost:8092/api/ratings/rating/user/${ratingForm.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const hasRatedAllItems = order.items.every(item => {
        return ratedOrdersResponse.data.some(rating => rating.productId === item.productId);
      });
      
      setRatingForm(prev => ({ ...prev, productId: unratedItems[0].productId }));
      
      // If the user has already rated all items in the order, show a popup message
      if (hasRatedAllItems) {
        alert('You have already submitted ratings for all products in this order.');
        setSelectedOrder(null); // Clear selected order
      } else if (unratedItems.length === 0) {
        // If all items in the order are rated, set the selected order to null to prevent showing the rating form
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Error fetching ratings by user ID:', err);
    }
  };

  return (
    <div className='myOrder'>
      <Header />
      <div className='order-back'>
      <div className="order-container">
        {orders.map(order => (
          <div className="order" key={order.id}>
            <h2>Order ID: {order.id}</h2>
            <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
            <p>Status: {order.status}</p>
            <p>Total Amount: ₹{order.orderAmount}</p>
            <h3>Items:</h3>
            <ul>
              {order.items.map(item => (
                <li key={item.orderItemId}>
                  <div className="order-item">
                    <img src={productImages[item.productId]} alt={item.name} className="order-item-image" />
                    <div className="order-item-details">
                      <h4>{item.name}</h4>
                      <p>Price: ₹{item.price.toFixed(2)}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {selectedOrder === order.id && (
              <div className="rating-form">
                <h3>Submit Your Rating</h3>
                <form onSubmit={submitRating}>
                  <input type="hidden" name="userId" value={ratingForm.userId} readOnly />
                  <label>
                    Product:
                    <select name="productId" value={ratingForm.productId} onChange={handleRatingChange}>
                      {order.items.map(item => (
                        !ratedOrders.has(item.productId) && (
                          <option key={item.productId} value={item.productId}>{item.name}</option>
                        )
                      ))}
                    </select>
                  </label>
                  <label>
                    Rating:
                    <input type="number" name="rating" min="1" max="5" value={ratingForm.rating} onChange={handleRatingChange} required />
                  </label>
                  <label>
                    Review:
                    <textarea name="review" value={ratingForm.review} onChange={handleRatingChange} required></textarea>
                  </label>
                  <button type="submit" className="submit-rating-btn">
                    {ratedOrders.has(ratingForm.productId) ? 'Update Rating' : 'Submit Rating'}
                  </button>
                  <button type="button" className="cancel-rating-btn" onClick={() => setSelectedOrder(null)}>Cancel</button>
                </form>
              </div>
            )}
            {selectedOrder !== order.id && (
              <button
                className="proceed-to-checkout-btn"
                onClick={() => showRatingFormForOrder(order.id)}
                disabled={order.items.every(item => ratedOrders.has(item.productId))}
              >
                {ratingDataLoaded && ratedOrders.has(order.items[0].productId) ? 'Update Rating' : 'Add Ratings'}
              </button>
            )}
          </div>
        ))}
      </div>
      <Footer />
    </div>
    </div>
  );
};

export default MyOrder;
