import React, { useState } from 'react';

import './Contact.css';
import Footer from '../Footer/Footer';
import Header from './Header';
import { logo } from "../../../assets/images";
import Image from "../../designLayouts/Image";
  // Import a CSS file to style the components

function Contact() {
    return (
        <div>
            <Header />
        <div className="container">
            <div className="left-panel">
                <div className="brand">
                    <Image className="w-48 object-cover" imgSrc={logo} />
                </div>
                <h3>Contact us to know more...</h3>
            </div>
            <div className="right-panel">
                <div className="form-container">
                    <h2>Contact Us</h2>
                    <form>
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" id="firstName" name="firstName" required />

                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" id="lastName" name="lastName" required />

                        <label htmlFor="email">Email Address:</label>
                        <input type="email" id="email" name="email" required />
                        
                        <label htmlFor="phone">Phone Number:</label>
                        <input type="tel" id="phone" name="phone" required />

                        <label htmlFor="message">Write Your Message:</label>
                        <textarea id="message" name="message" required></textarea>
                        
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
        <Footer />
        </div>
    );
}

export default Contact;
