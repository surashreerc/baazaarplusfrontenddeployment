import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BestSeller.css';
import Heading from '../../components/home/Products/Heading';

const BestSeller = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        // Fetch the first 4 products
        const response = await axios.get('https://api.baazaarplus.xyz/api/products/product');
        const topProducts = response.data.sort((a,b)=>{
          const ratingA = (a.averageRating);
          const ratingB = (b.averageRating);
          return ratingB-ratingA;
        }).slice(0,4);

        // Set the top products to state
        setProducts(topProducts);
      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    };

    fetchTopProducts();
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    document.getElementById('productModal').style.display = 'block';
  };

  const closeModal = () => {
    setSelectedProduct(null);
    document.getElementById('productModal').style.display = 'none';
  };

  if (products.length === 0) {
    return <div className="loading">Loading...</div>; // You can render a loading spinner or message here
  }

  return (
    <div>
       <Heading heading="Best Sellers" />
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="best-seller-badge">Best Seller</div>
            <div className="product-image-container">
              <img className="product-image" src={product.image} alt={product.name} />
              <div className="overlay">
                <button className="view-details-btn" onClick={() => handleViewDetails(product)}>View Details</button>
              </div>
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
              <p>Rating: {product.averageRating.toFixed(1)}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div id="productModal" className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <img className="product-image" src={selectedProduct.image} alt={selectedProduct.name} />
            <div className="product-details">
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.description}</p>
              <p>Price: {selectedProduct.price}</p>
              <p>Rating: {selectedProduct.averageRating}</p>
            </div>
            <div className="modal-buttons">
              <button className="modal-button shop-btn" onClick={() => window.location.href = '/shop'}>Shop</button>
              <button className="modal-button close-modal-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestSeller;
