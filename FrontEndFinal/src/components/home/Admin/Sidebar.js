import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';
import ProductModal from './ProductModal';
import EditProductModal from './EditProductModal';
import DeleteProductModal from './DeleteProductModal';
import AddCategoryModal from './AddCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal'; // Import DeleteCategoryModal

const Sidebar = ({ onCategoryChange, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false); // State for DeleteCategoryModal
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // State to store selected category ID

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8085/api/categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
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
    onCategoryChange(updatedSelectedCategories);
  };

  const handleAddCategory = () => {
    setIsAddCategoryModalOpen(true);
  };

  const handleAddProduct = () => {
    setIsProductModalOpen(true);
  };

  const handleEditProduct = () => {
    setIsEditProductModalOpen(true);
  };

  const handleDeleteProduct = () => {
    setIsDeleteProductModalOpen(true);
  };

  const handleDeleteCategory = () => {
    setIsDeleteCategoryModalOpen(true); // Open DeleteCategoryModal
  };

  const handleDeleteCategoryConfirm = () => {
    // Logic to delete category using selectedCategoryId
    console.log('Deleting category with ID:', selectedCategoryId);
    setIsDeleteCategoryModalOpen(false); // Close DeleteCategoryModal
  };

  return (
    <div className="sidebar">
      <div className="sidebar-actions">
        <button className="action-button" onClick={handleAddCategory}>
          <FontAwesomeIcon icon={faPlus} /> Add Category
        </button>
        <button className="action-button" onClick={handleAddProduct}>
          <FontAwesomeIcon icon={faPlus} /> Add Product
        </button>
        <button className="action-button" onClick={handleEditProduct}>
          <FontAwesomeIcon icon={faEdit} /> Edit Product
        </button>
        <button className="action-button" onClick={handleDeleteProduct}>
          <FontAwesomeIcon icon={faTrash} /> Delete Product
        </button>
        <button className="action-button" onClick={handleDeleteCategory}>
          <FontAwesomeIcon icon={faTrash} /> Delete Category
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

      {/* Modals */}
      <ProductModal 
        isOpen={isProductModalOpen} 
        onRequestClose={() => setIsProductModalOpen(false)} 
        categories={categories}
      />
      <EditProductModal 
        isOpen={isEditProductModalOpen} 
        onRequestClose={() => setIsEditProductModalOpen(false)} 
      />
      <DeleteProductModal 
        isOpen={isDeleteProductModalOpen} 
        onRequestClose={() => setIsDeleteProductModalOpen(false)} 
      />
      <AddCategoryModal 
        isOpen={isAddCategoryModalOpen} 
        onRequestClose={() => setIsAddCategoryModalOpen(false)} 
      />
      <DeleteCategoryModal 
        isOpen={isDeleteCategoryModalOpen} 
        onRequestClose={() => setIsDeleteCategoryModalOpen(false)} 
        categoryId={selectedCategoryId} // Pass selectedCategoryId
        onDeleteSuccess={handleDeleteCategoryConfirm} // Handle delete confirmation
      />
    </div>
  );
};

export default Sidebar;
