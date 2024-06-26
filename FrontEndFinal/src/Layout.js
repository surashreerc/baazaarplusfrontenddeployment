import {
   
    Outlet,
    
  } from "react-router-dom";
import React, { useContext } from "react";
import Footer from "./components/home/Footer/Footer";

import Header from "./components/home/Header/Header";
import BestSeller from "././pages/Shop/BestSeller"

import Hero from "./components/Hero/Hero";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import VideoWithCards from "./components/Video/VideoWithCards";
import { UserContext } from "./UserContext";

const Layout = () => {
  const { userRole } = useContext(UserContext);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
       
      <Header />
      
      
      <Outlet />
      <BestSeller/>
      <Hero />
      <VideoWithCards />
      <Footer />
    </div>
  );
};

export default Layout;
