import React, { useState } from "react";
import { FaFacebook,FaInstagram} from "react-icons/fa";
import FooterListTitle from "./FooterListTitle";
import { SiRazorpay } from "react-icons/si";
import { AiOutlineCopyright } from "react-icons/ai";

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
          <div className="w-full">
          <p className="text-center mb-4">
            <img src="https://i.ibb.co/fF5cLts/razorpay.png" alt="Razorpay Logo" style={{height:"30px"}}/>
          </p>
        </div>
        </div>
        <div className="col-span-2 flex flex-col items-center w-full px-4">
          <FooterListTitle title="Contact Us On" />
          <div className="w-full">
            <p className="text-center mb-4">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=plusbaazaar@gmail.com" target="_blank">plusbaazaar@gmail.com</a>
              <p>1800-103-5577</p>
            </p>

           
          </div>
        </div>
      </div>
      <div className="w-full bg-[#F5F5F3] group">
      <div className="max-w-container mx-auto border-t-[1px] pt-10 ">
        <p className="text-titleFont font-normal text-center flex md:items-center justify-center text-lightText duration-200 text-sm">
          <span className="text-md mr-[1px] mt-[2px] md:mt-0 text-center hidden md:inline-flex">
            <AiOutlineCopyright />
          </span>
          Copyright 2024 | Baazaar + | All Rights Reserved |
          <a href="https://baazaar.com/" target="_blank" rel="noreferrer">
            <span className="ml-1 font-medium group-hover:text-primeColor">
              Powered by Baazaar +
            </span>
          </a>
        </p>
      </div>
    </div>
    </div>
    
  );
};

export default Footer;
