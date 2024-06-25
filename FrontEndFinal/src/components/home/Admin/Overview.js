import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDetail from './UserDetail'; // Import UserDetail component
import ProductDetail from './ProductDetail'; // Import ProductDetail component
import OrderDetail from './OrderDetail'; // Import OrderDetail component
import Header from '../../../components/home/Header/Header';
import Footer from '../../../components/home/Footer/Footer';

const Overview = () => {
  const [selectedDetail, setSelectedDetail] = useState('User'); // Initial selection is User Detail
  const [userData, setUserData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch data when the component mounts
    fetchUserData();
    fetchProductData();
    fetchOrderData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('https://api.baazaarplus.xyz/api/auth/users');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProductData = async () => {
    try {
      const response = await axios.get('https://api.baazaarplus.xyz/api/products/product');
      setProductData(response.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  const fetchOrderData = async () => {
    try {
      const response = await axios.get('https://api.baazaarplus.xyz/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderData(response.data);
    } catch (error) {
      console.error('Error fetching order data:', error);
    }
  };

  // Function to handle sidebar item selection
  const handleDetailSelection = (detail) => {
    setSelectedDetail(detail);
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{
          width: '250px',
          backgroundColor: '#e6be8a',
          padding: '20px',
          color: '#fff',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          minHeight: '100%' // Ensure sidebar takes full height
        }}>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            <li style={{
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: selectedDetail === 'User' ? '#fff' : 'transparent',
              color: selectedDetail === 'User' ? '#e6be8a' : '#fff',
              borderRadius: '5px',
              marginBottom: '10px',
              textAlign: 'center'
            }} onClick={() => handleDetailSelection('User')}>User Details</li>
            <li style={{
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: selectedDetail === 'Product' ? '#fff' : 'transparent',
              color: selectedDetail === 'Product' ? '#e6be8a' : '#fff',
              borderRadius: '5px',
              marginBottom: '10px',
              textAlign: 'center'
            }} onClick={() => handleDetailSelection('Product')}>Product Details</li>
            <li style={{
              cursor: 'pointer',
              padding: '10px',
              backgroundColor: selectedDetail === 'Order' ? '#fff' : 'transparent',
              color: selectedDetail === 'Order' ? '#e6be8a' : '#fff',
              borderRadius: '5px',
              textAlign: 'center'
            }} onClick={() => handleDetailSelection('Order')}>Order Details</li>
          </ul>
        </div>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f9f9f9' }}>
          {selectedDetail === 'User' && userData && <UserDetail userData={userData} />}
          {selectedDetail === 'Product' && productData && <ProductDetail productData={productData} />}
          {selectedDetail === 'Order' && orderData && <OrderDetail orderData={orderData} />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Overview;
