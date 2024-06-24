import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './cart.css';
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer';
import { useDispatch } from 'react-redux';
import { removeFromCart, increaseQuantity, decreaseQuantity } from '../../pages/Shop/redux/orebiSlice';
import { toast } from 'react-toastify';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [inventory, setInventory] = useState({});
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const { userEmail } = useContext(UserContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('http://13.200.241.188:9090/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = userResponse.data.find(user => user.email === userEmail);
        const userId = user.id;

        const response = await axios.get(`http://13.200.241.188:9090/carts/cart/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const items = response.data.cartItems.reduce((acc, item) => {
          const existingItem = acc.find(accItem => accItem.productId === item.productId);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            acc.push(item);
          }
          return acc;
        }, []);
        setCartItems(items);

        // Fetch inventory data
        const inventoryResponse = await axios.get('http://13.200.241.188:9090/inventory/all-inventory', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const inventoryData = inventoryResponse.data.reduce((acc, item) => {
          acc[item.productId] = item.stock;
          return acc;
        }, {});
        setInventory(inventoryData);
      } catch (err) {
        console.error('Error fetching cart items:', err);
      }
    };

    fetchCartItems();
  }, [userEmail]);

  const handleRemoveFromCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get('http://13.200.241.188:9090/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = userResponse.data.find(user => user.email === userEmail);
      const userId = user.id;

      const response = await axios.delete('http://13.200.241.188:9090/carts/cart/product/remove', {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId, productId }
      });

      console.log(response);  // Log the response to see if the request was successful

      setCartItems(cartItems.filter(item => item.productId !== productId));
      dispatch(removeFromCart(productId));
      toast.success('Product removed from cart!');
    } catch (err) {
      console.error('Error removing from cart:', err);
      toast.error('Failed to remove product from cart. Please try again later.');
    }
  };

  const handleIncreaseQuantity = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get('http://13.200.241.188:9090/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = userResponse.data.find(user => user.email === userEmail);
      const userId = user.id;

      const response = await axios.put('http://13.200.241.188:9090/carts/cart/product/increase', {
        userId,
        productId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response);  // Log the response to see if the request was successful

      setCartItems(cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
      ));
      dispatch(increaseQuantity(productId));
      toast.success('Product quantity increased!');
    } catch (err) {
      console.error('Error increasing quantity:', err);
      toast.error('Failed to increase product quantity. Please try again later.');
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get('http://13.200.241.188:9090/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = userResponse.data.find(user => user.email === userEmail);
      const userId = user.id;

      const response = await axios.put('http://13.200.241.188:9090/carts/cart/product/decrease', {
        userId,
        productId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response);  // Log the response to see if the request was successful

      setCartItems(cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
      ));
      dispatch(decreaseQuantity(productId));
      toast.success('Product quantity decreased!');
    } catch (err) {
      console.error('Error decreasing quantity:', err);
      toast.error('Failed to decrease product quantity. Please try again later.');
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get('http://13.200.241.188:9090/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = userResponse.data.find(user => user.email === userEmail);
      const userId = user.id;

      const response = await axios.delete(`http://13.200.241.188:9090/carts/cart/clear/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log(response);  // Log the response to see if the request was successful

      setCartItems([]);
      toast.success('Cart cleared!');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart. Please try again later.');
    }
  };

  const calculateTotalAmount = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className='cart'>
      <Header />
      <div className='cart-body'>
      
      <div className="cart-container">
        <h1 className="cart-header">Your Cart- It's Yours</h1>
        {error && <p className="error">{error}</p>}
        {cartItems.length > 0 ? (
          <>
            <div className="cart-products">
              {cartItems.map(item => (
                <div key={item.productId} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h2>{item.name}</h2>
                    <p>Price: ₹{item.price.toFixed(2)}</p>
                    <div className="quantity-controls">
                      <button onClick={() => handleDecreaseQuantity(item.productId)} disabled={item.quantity <= 1}>-</button>
                      <span style={{margin:'10px'}}>{item.quantity}</span>
                      <button onClick={() => handleIncreaseQuantity(item.productId)} disabled={item.quantity >= inventory[item.productId]}>+</button>
                    </div>
                    <p>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => handleRemoveFromCart(item.productId)} className="remove-button">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-totals">
              <div className="cart-totals-container">
              <button onClick={handleClearCart} className="clear-cart-btn">Clear Cart</button>
                <h1>Order Summary</h1>
                <p>
                  <span>Total Amount:</span> <span>₹{calculateTotalAmount()}</span>
                </p>
               
                <Link to="/orderconfirm"><button className="proceed-to-checkout-btn">Proceed to Order</button></Link> 
               
              </div>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-container">
              <h1>Your cart is empty</h1>
              <p>Add some products to your cart to continue shopping.</p>
             <Link to = "/shop"> <button className="proceed-to-checkout-btn">Continue Shopping</button></Link>
            </div>
          </div>
          
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
