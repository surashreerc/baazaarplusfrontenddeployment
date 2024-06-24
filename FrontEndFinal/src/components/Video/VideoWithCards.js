import React from 'react';
import './VideoWithCards.css';

const VideoWithCards = () => {
  return (
    <div className="video-cards-container">
      <div className="video-section">
        <video className="promo-video" autoPlay loop muted>
          <source src="https://videos.pexels.com/video-files/3626148/3626148-hd_1366_720_50fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="cards-section">
        <h2>Why Shop With Us</h2>
        <div className="cards">
          <div className="card">
            <h3>High Quality</h3>
            <p>We provide top-notch products that meet your needs and exceed expectations.</p>
          </div>
          <div className="card">
            <h3>Best Prices</h3>
            <p>Enjoy competitive prices and great deals on a wide range of products.</p>
          </div>
          <div className="card">
            <h3>Excellent Support</h3>
            <p>Our customer support team is here to assist you with any inquiries you may have.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoWithCards;
