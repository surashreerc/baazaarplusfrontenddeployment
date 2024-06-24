import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inven.css';
import Header from '../../../components/home/Header/Header';
import SidebarInven from './SidebarInven';
import Footer from '../../../components/home/Footer/Footer';
import ProductModal from './ProductModal'; // Import the modal component
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../pages/Shop/redux/orebiSlice';
import { toast } from 'react-toastify';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [inventory, setInventory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductsAndInventory = async () => {
      try {
        const [productsResponse, inventoryResponse] = await Promise.all([
          axios.get('http://13.200.241.188:9090/api/categories'),
          axios.get('http://13.200.241.188:9090/inventory/all-inventory')
        ]);

        const categories = productsResponse.data;
        const inventoryData = inventoryResponse.data;

        // Extract all products from the categories
        const allProducts = categories.flatMap(category =>
          category.products.map(product => ({
            ...product,
            category_id: category.id,
            stock: inventoryData.find(item => item.productId === product.id)?.stock || 0
          }))
        );

        setProducts(allProducts);
        setFilteredProducts(allProducts); // Initialize filtered products with all products
        setCategories(categories); // Save categories for dropdown in modal
        setInventory(inventoryData);
      } catch (err) {
        setError('Failed to fetch products or inventory. Please try again later.');
        console.error('Error fetching products or inventory:', err);
      }
    };

    fetchProductsAndInventory();
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
    if (searchQuery.trim() === '') {
      setFilteredProducts(products);
      return;
    }

    try {
      const response = await axios.get(`http://13.200.241.188:9090/api/products/product/search?query=${searchQuery}`);
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
          <SidebarInven
            onCategoryChange={handleCategoryChange}
            onAddProduct={() => setIsModalOpen(true)} // Open the modal when clicking on "Add Product" in the sidebar
          />
          <div className="shop-main">
            <h1>My Products</h1>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="products">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div key={product.id} className="product-container">
                    <div className="product-image-wrapper">
                      <img src={product.image} alt={product.name} className="product-image" />
                      {product.stock <= 0 ? (
                        <div className="stock-status out-of-stock">Out of Stock</div>
                      ) : (
                        <div className="stock-status in-stock">In Stock</div>
                      )}
                    </div>
                    <div className="product-details">
                      <h2>{product.name}</h2>
                      <p>{product.description}</p>
                      <p>Product Id: {product.id}</p>
                      <p>Price: ₹{product.price.toFixed(2)}</p>
                      <p>Rating: {product.averageRating}</p>
                      <p>Category ID: {product.category_id}</p>
                      <p>Stock: {product.stock}</p>
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

export default Inventory;
