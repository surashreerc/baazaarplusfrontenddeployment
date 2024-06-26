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
            <div className="right-panel">
                

 <div className="containerStyle">
      <div>
      <h1 className="main-heading">Contact Us</h1>
        <div className="headerStyle">Do you need help getting started?</div>
        <div className="subHeaderStyle">
          We’ll help you every step of the way! Simply send us an email or give us a call for assistance. (All days, between 7:00 a.m. to 10:00 p.m.)
        </div>
        <div className="contactItemStyle">
          <span className="iconStyle">📞</span>
          <span className="textStyle">Call</span>
        </div>
        <div className="textStyle">1800--103-5577</div>
        <div className="contactItemStyle" style={{ marginTop: '20px' }}>
          <span className="iconStyle">📧</span>
          <span className="textStyle">Email</span>
        </div>
        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=plusbaazaar@gmail.com" target="_blank">plusbaazaar@gmail.com</a>
      </div>
      <div className="loginContainerStyle">
        <iframe
          src="https://maps.google.com/maps?q=19.0078103,72.8294108&z=15&output=embed"
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: '0' }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
          title="Location Map"
        ></iframe>
        <div className="loginHeaderStyle">Log in for more!</div>
        <div className="loginTextStyle">
          To make the most of our offers, track your order history and re-order products, we recommend that you Login / Create to your account.
        </div>
      </div>
    </div>

            </div>
        </div>
        <Footer />
        </div>
    );
}

export default Contact;
