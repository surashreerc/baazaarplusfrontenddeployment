import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Shop.css';
import Header from '../../components/home/Header/Header';
import Sidebar from './Sidebar';
import Footer from '../../components/home/Footer/Footer';
import { FaShoppingCart } from 'react-icons/fa';
import { MdOutlineLabelImportant } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../pages/Shop/redux/orebiSlice';
import { toast } from 'react-toastify';
import { UserContext } from '../../UserContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userEmail } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState({}); // State to track whether each product is added to cart
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchProductsAndStock = async () => {
      try {
        const token = localStorage.getItem('token');
        const [productResponse, stockResponse] = await Promise.all([
          axios.get('https://api.baazaarplus.xyz/api/categories', {
            //headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('https://api.baazaarplus.xyz/inventory/all-inventory', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const categories = productResponse.data;
        const allProducts = categories.flatMap(category => 
          category.products.map(product => ({
            ...product,
            category_id: category.id,
            category_name: category.name
          }))
        );

        const stockData = stockResponse.data;
        setProducts(allProducts);
        setFilteredProducts(allProducts);
        setStockData(stockData);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error('Error fetching products or stock:', err);
      }
    };

    fetchProductsAndStock();

    // Check if user is logged in
    setIsLoggedIn(!!userEmail);
  }, [userEmail]);

  const handleProductDetails = (product) => {
    navigate(`/product/${product.name.replace(/\s+/g, '-').toLowerCase()}`, {
      state: product,
    });
  };

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      // Prompt user to register or login if not logged in
      alert('Please register or login to add products to your cart.');
      return;
    }

    if (isAddingToCart) return;

    setIsAddingToCart(true);

    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get('https://api.baazaarplus.xyz/api/auth/users');
      const user = userResponse.data.find(user => user.email === userEmail);
      const userId = user.id;

      await axios.post('https://api.baazaarplus.xyz/carts/cart/product/add', {
        userId,
        productId: product.id,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      dispatch(addToCart({ ...product, quantity: 1 }));
      toast.success('Product added to cart!');
      setIsAddedToCart(prev => ({ ...prev, [product.id]: true }));
    } catch (err) {
      console.error('Error adding to cart:', err);
      toast.error('Failed to add product to cart. Please try again later.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCategoryChange = (selectedCategories) => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        selectedCategories.includes(product.category_id)
      );
      setFilteredProducts(filtered);
    }
  };

  const handleSearch = async () => {
    try {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category_name.toLowerCase().includes(query));
      setFilteredProducts(filtered);
    } catch (err) {
      setError('Failed to search products. Please try again later.');
      console.error('Error searching products:', err);
    }
  };

  const getStockStatus = (productId) => {
    const stockInfo = stockData.find(stock => stock.productId === productId);
    return stockInfo && stockInfo.stock > 0 ? 'In Stock' : 'Out of Stock';
  };

  return (
    <div className='head'>
      <Header />
      <div className="shop-container">
        <div className="shop-content">
          <Sidebar onCategoryChange={handleCategoryChange} />
          <div className="shop-main">
            <h1>Shop</h1>
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
                      <div className="product-overlay">
                        <button onClick={() => handleProductDetails(product)} className="overlay-button">
                          View Details <MdOutlineLabelImportant />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`overlay-button ${getStockStatus(product.id) === 'Out of Stock' ? 'disabled' : ''}`}
                          disabled={isAddingToCart || isAddedToCart[product.id] || getStockStatus(product.id) === 'Out of Stock'}
                        >
                          {isAddedToCart[product.id] ? 'Added to Cart' : 'Add to Cart'} <FaShoppingCart />
                        </button>
                      </div>
                    </div>
                    <div className="product-details">
                      <h2>{product.name}</h2>
                      <p>{product.description}</p>
                      <p>Price: ₹{product.price.toFixed(2)}</p>
                      <p>Rating: {product.averageRating}</p>
                      <p>Category: {product.category_name}</p>
                      <p>Status: {getStockStatus(product.id)}</p>
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
    </div>
  );
};

export default Shop;
