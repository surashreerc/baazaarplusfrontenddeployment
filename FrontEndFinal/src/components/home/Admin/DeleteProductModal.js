import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const DeleteProductModal = ({ isOpen, onRequestClose, onDeleteSuccess }) => {
  const [productId, setProductId] = useState('');
  const [productIds, setProductIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      background: '#fff',
      position: 'absolute',
      zIndex: '1000',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  };

  const buttonStyles = {
    padding: '8px 16px',
    borderRadius: '5px',
    border: 'none',
    background: '#e6be8a',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
    marginRight: '8px',
  };

  const cancelButtonStyles = {
   ...buttonStyles,
    background: '#6c757d',
  };

  useEffect(() => {
    const fetchProductIds = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://13.200.241.188:9090/api/products/product');
        const productIds = response.data.map((product) => product.id);
        setProductIds(productIds);
      } catch (error) {
        console.error('Error fetching product IDs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductIds();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://13.200.241.188:9090/api/products/product/${productId}`);
      onDeleteSuccess();
      onRequestClose();
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Delete Product</h2>
      <p>Are you sure you want to delete this product?</p>
      <div>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{ width: '100%', padding: '8px', fontSize: '14px' }}
        >
          <option value="">Select a product ID</option>
          {productIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        {loading? (
          <p>Loading...</p>
        ) : (
          <div>
            <button onClick={handleDelete} style={buttonStyles}>
              Delete
            </button>
            <button onClick={onRequestClose} style={cancelButtonStyles}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DeleteProductModal;