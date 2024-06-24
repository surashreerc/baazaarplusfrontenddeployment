import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import UpdateStockModal from './UpdateStockModal';

const SidebarInven = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://13.200.241.188:9090/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://13.200.241.188:9090/inventory/all-inventory');
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchCategories();
    fetchProducts(); // Fetch products initially
  }, []);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value);

    let updatedSelectedCategories;
    if (checked) {
      updatedSelectedCategories = [...selectedCategories, categoryId];
    } else {
      updatedSelectedCategories = selectedCategories.filter(cat => cat !== categoryId);
    }

    setSelectedCategories(updatedSelectedCategories);
    // Call function to filter products based on selected categories if needed
  };

  const handleEditProduct = () => {
    setIsEditProductModalOpen(true);
  };

  const handleUpdateSuccess = async () => {
    // Refetch products after updating stock
    try {
      const response = await axios.get('http://13.200.241.188:9090/inventory/all-inventory');
      setProducts(response.data);
    } catch (err) {
      console.error('Error refetching products:', err);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-actions">
        <button className="action-button" onClick={handleEditProduct}>
          <FontAwesomeIcon icon={faEdit} /> Update Stock
        </button>
      </div>
      <br />
      <h5>Categories</h5>
      <ul>
        {categories.length > 0 ? (
          categories.map(category => (
            <li key={category.id}>
              <input
                type="checkbox"
                id={category.name}
                name="category"
                value={category.id}
                checked={selectedCategories.includes(category.id)}
                onChange={handleCategoryChange}
              />
              <label htmlFor={category.name}>{category.name}</label>
            </li>
          ))
        ) : (
          <p>Loading categories...</p>
        )}
      </ul>

      <UpdateStockModal
        isOpen={isEditProductModalOpen}
        onRequestClose={() => setIsEditProductModalOpen(false)}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default SidebarInven;
