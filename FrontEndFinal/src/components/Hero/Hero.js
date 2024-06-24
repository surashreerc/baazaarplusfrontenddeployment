import React from 'react';
import './Hero.css';
import {
  hero1,
  hero2,
  hero3,
  hero4,
  hero5,
  hero6,
  hero7,
  hero8,
} from '../../assets/images';

const Hero = () => {
  return (
    <div className="hero">
      <div className="train-carousel">
        <div className="image-container">
          <img src={hero1} alt="Banner 1" />
          <img src={hero2} alt="Banner 2" />
          <img src={hero3} alt="Banner 3" />
          <img src={hero4} alt="Banner 4" />
          <img src={hero5} alt="Banner 5" />
          <img src={hero6} alt="Banner 6" />
          <img src={hero7} alt="Banner 7" />
          <img src={hero8} alt="Banner 8" />
          {/* Repeat images for continuous effect */}
          <img src={hero1} alt="Banner 1" />
          <img src={hero2} alt="Banner 2" />
          <img src={hero3} alt="Banner 3" />
          <img src={hero4} alt="Banner 4" />
          <img src={hero5} alt="Banner 5" />
          <img src={hero6} alt="Banner 6" />
          <img src={hero7} alt="Banner 7" />
          <img src={hero8} alt="Banner 8" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
