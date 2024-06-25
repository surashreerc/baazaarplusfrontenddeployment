import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';

const AddCategoryModal = ({ isOpen, onRequestClose, onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '400px',
      height: '400px',
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

  const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '14px',
  };

  const inputStyles = {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
    width: '100%',
  };

  const buttonStyles = {
    padding: '8px 16px',
    borderRadius: '5px',
    border: 'none',
    background: '#e6be8a',
    color: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  };

  const cancelButtonStyles = {
    ...buttonStyles,
    background: '#6c757d',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('https://api.baazaarplus.xyz/api/categories', { 
        name: categoryName,
        description: categoryDescription,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Category added:', response.data);
      setCategoryName('');
      setCategoryDescription('');
      onRequestClose();
      window.location.reload(); // Refresh the page
      
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Add Category</h2>
      <form onSubmit={handleSubmit} style={formStyles}>
        <label style={labelStyles}>
          Category Name:
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
            style={inputStyles}
          />
        </label>
        <label style={labelStyles}>
          Category Description:
          <input
            type="text"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            style={inputStyles}
          />
        </label>
        <button type="submit" style={buttonStyles}>Add Category</button>
      </form>
      <button onClick={onRequestClose} style={cancelButtonStyles}>Cancel</button>
    </Modal>
  );
};

export default AddCategoryModal;
