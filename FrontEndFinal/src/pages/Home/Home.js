import React, { useContext } from "react";
import Banner from "../../components/Banner/Banner";
import NewArrivals from "../../components/home/NewArrivals/NewArrivals";
import BannerBottom from "../../components/Banner/BannerBottom";
import { UserContext } from "../../UserContext"; // Make sure to import UserContext correctly

const Home = () => {
  const { userEmail } = useContext(UserContext); // Retrieve userEmail from UserContext

  return (
    <div className="w-full mx-auto">
      <Banner />
      <NewArrivals />
      <BannerBottom />
      
    </div>
  );
};

export default Home;
