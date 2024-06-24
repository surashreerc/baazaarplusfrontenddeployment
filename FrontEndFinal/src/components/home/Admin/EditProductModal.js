import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const EditProductModal = ({ isOpen, onRequestClose, onUpdateSuccess }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productIds, setProductIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProductDetails = async () => {
    if (!selectedProductId) return;

    try {
      const response = await axios.get(`http://localhost:8085/api/products/product/${selectedProductId}`);
      const product = response.data;
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setCategoryName(product.category.name);
    } catch (err) {
      console.error('Error fetching product details:', err);
    }
  };

  const modalStyles = {
    content: {
      top: '55%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '800px',
      height: '580px',
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
    marginTop: '8px',
  };

  const handleFileChange = (event) => {
    setProductImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure price are numbers
    const parsedPrice = parseFloat(price);
  

    // Check for invalid values
    if (isNaN(parsedPrice)) {
      alert('Please enter valid numeric values for price.');
      return;
    }

    try {
      const selectedCategory = categories.find(category => category.name === categoryName);
      const categoryId = selectedCategory ? selectedCategory.id : '';

      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', parsedPrice);
      formData.append('categoryId', categoryId);
      if (productImage) {
        formData.append('productImage', productImage);
      }

      const response = await axios.put(
        `http://localhost:8085/api/products/product/${selectedProductId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Product updated:', response.data);
      if (typeof onUpdateSuccess === 'function') {
        onUpdateSuccess(response.data);
      }
      onRequestClose();
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={modalStyles}>
      <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Edit Product</h2>
      <form onSubmit={handleSubmit} style={formStyles}>
        <label style={labelStyles}>
          Select Product ID:
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          >
            <option value="">Select a product ID</option>
            {productIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={fetchProductDetails} style={buttonStyles}>Fetch</button>
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
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required style={inputStyles} />
        </label>
        <label style={labelStyles}>
          Category:
          <select value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required style={inputStyles}>
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </label>
        
        <label style={labelStyles}>
          Product Image:
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        <button type="submit" style={buttonStyles}>Update Product</button>
      </form>
      <button onClick={onRequestClose} style={cancelButtonStyles}>Cancel</button>
    </Modal>
  );
};

export default EditProductModal;
