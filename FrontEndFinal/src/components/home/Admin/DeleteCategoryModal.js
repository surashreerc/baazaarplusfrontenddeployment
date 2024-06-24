import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const DeleteCategoryModal = ({ isOpen, onRequestClose, onDeleteSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://13.200.241.188:9090/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

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

  const handleDelete = async () => {
    try {
      if (!selectedCategoryId) {
        console.error('No category selected.');
        return;
      }

      await axios.delete(`http://13.200.241.188:9090/api/categories/${selectedCategoryId}`);
      onDeleteSuccess();
      onRequestClose();
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Delete Category</h2>
      <p>Are you sure you want to delete this category?</p>
      <div>
        <label htmlFor="categoryDropdown">Select Category:</label>
        <select
          id="categoryDropdown"
          value={selectedCategoryId || ''}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <button onClick={handleDelete} style={buttonStyles}>Delete</button>
        <button onClick={onRequestClose} style={cancelButtonStyles}>Cancel</button>
      </div>
    </Modal>
  );
};

export default DeleteCategoryModal;
