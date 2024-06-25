import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';
import Header from '../../../components/home/Header/Header';
import Sidebar from './Sidebar';
import Footer from '../../../components/home/Footer/Footer';
import ProductModal from './ProductModal'; // Import the modal component
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../pages/Shop/redux/orebiSlice';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://api.baazaarplus.xyz/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const categories = response.data;

        // Extract all products from the categories
        const allProducts = categories.flatMap(category => 
          category.products.map(product => ({
            ...product,
            category_id: category.id, // Fetch category ID from the backend
            category_name: category.name // Fetch category name from the backend
          }))
        );

        setProducts(allProducts);
        setFilteredProducts(allProducts); // Initialize filtered products with all products
        setCategories(categories); // Save categories for dropdown in modal
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleProductDetails = (product) => {
    navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, {
      state: product,
    });
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success('Product added to cart!');
  };

  const handleCategoryChange = (selectedCategories) => {
    // Filter products based on selected categories
    if (selectedCategories.length === 0) {
      setFilteredProducts(products); // Show all products if no category is selected
    } else {
      const filtered = products.filter(product =>
        selectedCategories.includes(product.category_id)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://api.baazaarplus.xyz/api/products/product/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFilteredProducts(response.data);
    } catch (err) {
      setError('Failed to search products. Please try again later.');
      console.error('Error searching products:', err);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className='head'>
      <Header />
      <div className="shop-container">
        <div className="shop-content">
          <Sidebar
            onCategoryChange={handleCategoryChange}
            onAddProduct={() => setIsModalOpen(true)} // Open the modal when clicking on "Add Product" in the sidebar
          />
          <div className="shop-main">
            <h1>My Products</h1>
            <div className="search-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ padding: '10px', marginRight: '10px', width: '600px', border: '2px solid #e6be8a' }}
              />
              <button
                onClick={handleSearch}
                style={{ padding: '10px', backgroundColor: '#e6be8a', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                Search
              </button>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="products">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="product-container">
                    <div className="product-image-wrapper">
                      <img src={product.image} alt={product.name} className="product-image" />
                    </div>
                    <div className="product-details">
                      <h2>{product.name}</h2>
                      <p>{product.description}</p>
                      <p>Product Id: {product.id}</p>
                      <p>Price: ₹{product.price.toFixed(2)}</p>
                      <p>Rating: {product.averageRating}</p>
                      <p>Category: {product.category_name}</p> {/* Display category name */}
                    </div>
                  </div>
                ))
              ) : (
                <p>No products available.</p>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <ProductModal isOpen={isModalOpen} onRequestClose={handleModalClose} categories={categories} />
    </div>
  );
};

export default AddProduct;
