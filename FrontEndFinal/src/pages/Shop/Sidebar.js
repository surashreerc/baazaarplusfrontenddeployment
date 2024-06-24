import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Sidebar.css';

const Sidebar = ({ onCategoryChange }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    const categoryId = parseInt(value); // Convert to number if needed

    let updatedSelectedCategories;
    if (checked) {
      updatedSelectedCategories = [...selectedCategories, categoryId];
    } else {
      updatedSelectedCategories = selectedCategories.filter(cat => cat !== categoryId);
    }

    setSelectedCategories(updatedSelectedCategories);
    onCategoryChange(updatedSelectedCategories); // Notify parent component with updated categories
  };

  return (
    <div className="sidebar">
      <h3>Categories</h3>
      {categories.length > 0 ? (
        <ul>
          {categories.map(category => (
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
          ))}
        </ul>
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
};

export default Sidebar;