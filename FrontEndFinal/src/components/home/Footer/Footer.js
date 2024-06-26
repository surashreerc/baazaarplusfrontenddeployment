import React, { useState } from "react";
import { FaFacebook,FaInstagram} from "react-icons/fa";
import FooterListTitle from "./FooterListTitle";
import { SiRazorpay } from "react-icons/si";

const Footer = () => {
  const [emailInfo, setEmailInfo] = useState("");
  const [subscription, setSubscription] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const emailValidation = () => {
    return String(emailInfo)
      .toLocaleLowerCase()
      .match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };

  const handleSubscription = () => {
    if (emailInfo === "") {
      setErrMsg("Please provide an Email !");
    } else if (!emailValidation(emailInfo)) {
      setErrMsg("Please give a valid Email!");
    } else {
      setSubscription(true);
      setErrMsg("");
      setEmailInfo("");
    }
  };
  return (
    <div className="w-full bg-[#F5F5F3] py-20">
      <div className="max-w-container mx-auto grid grid-cols-1 md:grid-cols-2  xl:grid-cols-6 px-4 gap-10">
        <div className="col-span-2">
          <FooterListTitle title=" More about Baazaar +" />
          <div className="flex flex-col gap-6">
            <p className="text-base w-full xl:w-[80%]">
            Your ultimate destination for the latest in fashion, exclusive deals, and premium shopping. Discover a curated selection of top-quality products tailored just for you.
            </p>
          </div>
        </div>
        <div>
          <FooterListTitle title="Connect With Us" />
          <ul className="flex items-center gap-2">
              
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
              >
                <li className="w-7 h-7 bg-primeColor text-gray-100 hover:text-white cursor-pointer text-lg rounded-full flex justify-center items-center hover:bg-black duration-300">
                  <FaInstagram />
                </li>
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                <li className="w-7 h-7 bg-primeColor text-gray-100 hover:text-white cursor-pointer text-lg rounded-full flex justify-center items-center hover:bg-black duration-300">
                  <FaFacebook />
                </li>
              </a>
              
            </ul>
        </div>
        <div>
          <FooterListTitle title="Payment partner" />
          <ul className="flex flex-col gap-2">
          <SiRazorpay  />
          </ul>
        </div>
        <div className="col-span-2 flex flex-col items-center w-full px-4">
          <FooterListTitle title="Contact Us On" />
          <div className="w-full">
            <p className="text-center mb-4">
              <a href="mailto:plusbaazaar@gmail.com" target="_blank">plusbaazaar@gmail.com</a>
              <p>1800-103-5577</p>
            </p>

           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
