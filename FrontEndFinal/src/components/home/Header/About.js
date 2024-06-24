import React from 'react';
import './About.css';
import Header from './Header';
import Footer from '../Footer/Footer';


function About() {
    return (
        <div>
            <Header />
        <div className="about-container">
            <div className="about-content">
                <h1>About Us</h1>
                <p>Welcome to Baazaar+, your one-stop destination for all your shopping needs. We are passionate about bringing you the best products, exceptional customer service, and a seamless shopping experience. Our mission is to create a marketplace where quality meets affordability, and where every customer feels valued.</p>
                
                <h2>Our Story</h2>
                <p>Baazaar+ was founded with a simple idea: to make shopping easy, accessible, and enjoyable for everyone. What started as a small online store has grown into a thriving e-commerce platform, offering a wide range of products from fashion to electronics, home essentials, and more. We believe in the power of community and strive to build a shopping experience that reflects our values of trust, innovation, and excellence.</p>
                
                <h2>Our Values</h2>
                <ul>
                    <li><strong>Customer First:</strong> We prioritize our customers' needs and work tirelessly to exceed their expectations.</li>
                    <li><strong>Quality Assurance:</strong> We carefully curate our products to ensure they meet the highest standards of quality and reliability.</li>
                    <li><strong>Innovation:</strong> We are constantly evolving, embracing new technologies and trends to enhance your shopping experience.</li>
                    <li><strong>Sustainability:</strong> We are committed to promoting sustainable practices and offering eco-friendly products.</li>
                </ul>
                
                <h2>Why Choose Us?</h2>
                <p>At Baazaar+, we go beyond just selling products. We create experiences. With a user-friendly interface, secure payment options, and a dedicated customer support team, we ensure that your shopping journey is smooth and enjoyable. Join our growing community of satisfied customers and discover the joy of shopping with Baazaar+.</p>
                
                <p>Thank you for choosing Baazaar+. Happy Shopping!</p>
            </div>
        </div>
        <Footer />
        </div>
    );
}

export default About;
