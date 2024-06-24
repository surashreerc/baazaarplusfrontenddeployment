import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const UpdateStockModal = ({ isOpen, onRequestClose, onUpdateSuccess }) => {
  const [productId, setProductId] = useState('');
  const [productIds, setProductIds] = useState([]);
  const [stock, setStock] = useState(0);
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
        const response = await axios.get('http://localhost:8085/api/products/product');
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

  const handleUpdateStock = async () => {
    console.log('Updating stock:', productId, stock); // Add console log here

    try {
      const requestBody = {
        productId: productId,
        stock: stock,
      };
      await axios.post('http://localhost:8088/inventory/updateInventory', requestBody);
      console.log('Stock updated successfully');
      onUpdateSuccess();
      onRequestClose();
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Update Stock</h2>
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
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          min="0"
          style={{ width: '100%', padding: '8px', fontSize: '14px', marginTop: '10px' }}
          placeholder="Enter new stock value"
        />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleUpdateStock} style={buttonStyles}>
              Update
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

export default UpdateStockModal;
