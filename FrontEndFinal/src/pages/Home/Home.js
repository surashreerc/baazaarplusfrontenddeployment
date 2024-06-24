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
      <div className="max-w-container mx-auto px-4 text-color:black">
        {userEmail && <p>User Email: {userEmail}</p>}
      </div>
    </div>
  );
};

export default Home;
