import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductDetail = () => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await axios.get('http://13.200.241.188:9090/api/products/product');
      setProductData(response.data);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#e6be8a', borderBottom: '2px solid #e6be8a', paddingBottom: '10px' }}>Product Details</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {productData.map((product) => (
          <div key={product.id} style={{ flex: '1 1 calc(33.333% - 20px)', padding: '15px', border: '1px solid #e6be8a', borderRadius: '5px', backgroundColor: '#f9f9f9', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px', border: '1px solid #e6be8a', marginBottom: '10px' }} />
            <p style={{ margin: '5px 0' }}><strong>ID:</strong> <span style={{ color: '#555' }}>{product.id}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Name:</strong> <span style={{ color: '#555' }}>{product.name}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Description:</strong> <span style={{ color: '#555' }}>{product.description}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Price:</strong> <span style={{ color: '#555' }}>₹{product.price}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Category:</strong> <span style={{ color: '#555' }}>{product.category.name}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Created At:</strong> <span style={{ color: '#555' }}>{new Date(product.createdAt).toLocaleString()}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Updated At:</strong> <span style={{ color: '#555' }}>{new Date(product.updatedAt).toLocaleString()}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
