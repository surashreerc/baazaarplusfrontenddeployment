import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const ProductModal = ({ isOpen, onRequestClose, categories }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [stock, setStock] = useState(0);
  const [productImage, setProductImage] = useState(null);
  

  const modalStyles = {
    content: {
      top: '55%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '800px', // Reduced width
      height:'580px',
      padding: '15px', // Reduced padding
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

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px', // Reduced gap
  };

  const labelStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px', // Reduced gap
    fontSize: '14px', // Reduced font size
  };

  const inputStyles = {
    padding: '8px', // Reduced padding
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px', // Reduced font size
    width: '100%',
  };

  const buttonStyles = {
    padding: '8px 16px', // Reduced padding
    borderRadius: '5px',
    border: 'none',
    background: '#e6be8a',
    color: '#fff',
    fontSize: '14px', // Reduced font size
    cursor: 'pointer',
  };

  const cancelButtonStyles = {
    ...buttonStyles,
    background: '#6c757d',
    marginTop: '8px', // Reduced margin top
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('categoryId', categoryId);
      formData.append('stock', stock);
      formData.append('productImage', productImage);

      const response = await axios.post('https://api.baazaarplus.xyz/api/products/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Product added:', response.data);
      onRequestClose();
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleFileChange = (event) => {
    setProductImage(event.target.files[0]);
  };

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setDescription('');
      setPrice(0);
      setCategoryId(0);
      setStock(0);
      setProductImage(null);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Add Product</h2>
      <form onSubmit={handleSubmit} style={formStyles}>
        <label style={labelStyles}>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyles} />
        </label>
        <label style={labelStyles}>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required style={inputStyles} />
        </label>
        <label style={labelStyles}>
          Price:
          <input type="number" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required style={inputStyles} />
        </label>
        <label style={labelStyles}>
          Category:
          <select value={categoryId} onChange={(e) => setCategoryId(parseInt(e.target.value))} required style={inputStyles}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </label>
        <label style={labelStyles}>
          Stock:
          <input type="number" value={stock} onChange={(e) => setStock(parseInt(e.target.value))} required style={inputStyles} />
        </label>
        <label style={labelStyles}>
          Product Image:
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </label>
        <button type="submit" style={buttonStyles}>Add Product</button>
      </form>
      <button onClick={onRequestClose} style={cancelButtonStyles}>Cancel</button>
    </Modal>
  );
};

export default ProductModal;
