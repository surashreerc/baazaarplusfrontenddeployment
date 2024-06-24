import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './ProductGrid.css'; 

const products = [
  {
    id: 1,
    title: "The Passion Within",
    price: "₹1800",
    originalPrice: "₹5000",
    discount: "20% Off",
    rating: "★★★★★",
    ratingCount: "(235645)",
    tag: "BESTSELLER",
    image: "https://images.pexels.com/photos/256450/pexels-photo-256450.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
  },
  {
    id: 2,
    title: "Fresh StrawBerry",
    price: "₹2999",
    originalPrice: "6000",
    discount: "50%",
    rating: "★★★★★",
    ratingCount: "(58532)",
    tag: "BESTSELLER",
    image: "https://images.pexels.com/photos/6944172/pexels-photo-6944172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
  },
  {
    id: 3,
    title: "Fashionable Watch Toyoto ",
    price: "₹5036",
    originalPrice: "7995",
    discount: "37%",
    rating: "★★★★★",
    ratingCount: "(58532)",
    tag: "BESTSELLER",
    image: "https://images.pexels.com/photos/9826162/pexels-photo-9826162.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  },
  {
    id: 4,
    title: "Nikon Camera",
    price: "₹1,48,990",
    originalPrice: "1,59,990",
    discount: "6%",
    rating: "★★★★★",
    ratingCount: "(58532)",
    tag: "BESTSELLER",
    image: "https://images.pexels.com/photos/3907511/pexels-photo-3907511.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
  },
  // Add more products as needed...
];

const ProductGrid = () => {
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleImageClick = (product) => {
    setSelectedProduct(product);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedProduct(null);
  };

  return (
    <div className="product-grid-section">
      <h2>Best Selling Products</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-tag">{product.tag}</div>
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
              onClick={() => handleImageClick(product)}
            />
            <h3>{product.title}</h3>
            <p className="product-price">
              <span className="original-price">{product.originalPrice}</span> {product.price} {product.discount}
            </p>
            <p className="product-offer">{product.offer}</p>
            <p className="product-rating">
              {product.rating} <span className="rating-count">{product.ratingCount}</span>
            </p>
            <p className="product-shades">{product.shades}</p>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <Modal show={show} onHide={handleClose} size="sm">
          <Modal.Header closeButton>
            <Modal.Title>{selectedProduct.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={selectedProduct.image} alt={selectedProduct.title} />
            <p className="product-price">
              <span className="original-price">{selectedProduct.originalPrice}</span> {selectedProduct.price} {selectedProduct.discount}
            </p>
            <p className="product-rating">
              {selectedProduct.rating} <span className="rating-count">{selectedProduct.ratingCount}</span>
            </p>
            <p className="product-description">{selectedProduct.description}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary">Shop</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ProductGrid;