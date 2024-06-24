import React, { useState, useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { HiMenuAlt2 } from "react-icons/hi";
import { FaUser, FaCaretDown } from "react-icons/fa";
import { motion } from "framer-motion";
import { logo } from "../../../assets/images";
import Image from "../../designLayouts/Image";
import Flex from "../../designLayouts/Flex";
import { UserContext } from "../../../UserContext";


const Header = () => {
  const [sidenav, setSidenav] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { userRole, setUserRole } = useContext(UserContext);


  const handleLogout = () => {
    setUserRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    window.location.href = "/";
  };


  // Base navigation list
  let navBarList = [{ _id: 1001, title: "Home", link: "/" }];


  if (userRole === "ROLE_ADMIN") {
    navBarList.push(
      { _id: 1001, title: "Products", link: "/addproduct" },
      { _id: 1002, title: "Inventory", link: "/inventory" },
      { _id: 1003, title: "Overview", link: "/overview" },
      { _id: 1004, title: "Logout", link: "/", onClick: handleLogout }
    );
  } else if (userRole === "ROLE_USER") {
    navBarList.push(
      { _id: 1005, title: "Shop", link: "/shop" },
      { _id: 1006, title: "Cart", link: "/cart" },
      { _id: 1007, title: "My Orders", link: "/myorder" },
      { _id: 1008, title: "Profile", link: "/profile" },
      { _id: 1009, title: "Logout", link: "/", onClick: handleLogout }
    );
  } else {
    navBarList.push(
      { _id: 1010, title: "Shop", link: "/shop" },
      { _id: 1011, title: "About", link: "/about" },
      { _id: 1012, title: "Contact", link: "/contact" }
    );
  }


  return (
    <div className="w-full h-20 sticky top-0 z-50 border-b-[1px] border-b-gray-200" style={{ backgroundColor: "#e6be8a" }}>
      <nav className="h-full px-4 max-w-container mx-auto relative">
        <Flex className="flex items-center justify-between h-full">
          <Link to="/">
            <Image className="w-48 object-cover" imgSrc={logo} />
          </Link>
          <div>
            <motion.ul
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center w-auto z-50 p-0 gap-2"
            >
              {navBarList.map(({ _id, title, link, onClick }) => (
                <NavLink
                  key={_id}
                  className="flex font-normal hover:font-bold justify-center items-center px-8 text-base text-[white] hover:underline underline-offset-[4px] decoration-[1px] hover:text-[#262626] md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0 mr-4" // Added mr-4 here
                  to={link}
                  state={{ data: location.pathname.split("/")[1] }}
                  onClick={onClick}
                >
                  <li>{title}</li>
                </NavLink>
              ))}
              {!userRole && (
                <div className="relative">
                  <div
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center cursor-pointer text-white"
                  >
                    <FaUser />
                    <FaCaretDown />
                  </div>
                  {showUserMenu && (
                    <motion.ul
                      initial={{ y: -10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 mt-5 w-48 bg-white border rounded-lg shadow-lg z-50"
                    >
                      <li className="border-b border-gray-200">
                        <Link
                          to="/signin"
                          className="block px-4 py-2 text-gray-700 hover:bg-[#e6be8a]"
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/signup"
                          className="block px-4 py-2 text-gray-700 hover:bg-[#e6be8a]"
                        >
                          Register
                        </Link>
                      </li>
                    </motion.ul>
                  )}
                </div>
              )}
            </motion.ul>
            <HiMenuAlt2
              onClick={() => setSidenav(!sidenav)}
              className="inline-block md:hidden cursor-pointer w-8 h-6 absolute top-6 right-4"
            />
            {sidenav && (
              <div className="fixed top-0 left-0 w-full h-screen bg-black text-gray-200 bg-opacity-80 z-50">
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-[80%] h-full relative"
                >
                  <div className="w-full h-full bg-primeColor p-6">
                    <img className="w-28 mb-6" src={logo} alt="logoLight" />
                    <ul className="text-gray-200 flex flex-col gap-2">
                      {navBarList.map(({ _id, title, link, onClick }) => (
                        <li
                          className="font-normal hover:font-bold items-center text-lg text-gray-200 hover:underline underline-offset-[4px] decoration-[1px] hover:text-white md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                          key={_id}
                        >
                          <NavLink
                            to={link}
                            state={{ data: location.pathname.split("/")[1] }}
                            onClick={() => {
                              setSidenav(false);
                              if (onClick) onClick();
                            }}
                          >
                            {title}
                          </NavLink>
                        </li>
                      ))}
                      {!userRole && (
                        <>
                          <li
                            className="font-normal hover:font-bold items-center text-lg text-gray-200 hover:bg-[#e6be8a] underline-offset-[4px] decoration-[1px] hover:text-white md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                            onClick={() => setSidenav(false)}
                          >
                            <Link to="/signin">Login</Link>
                          </li>
                          <li
                            className="font-normal hover:font-bold items-center text-lg text-gray-200 hover:bg-[#e6be8a] underline-offset-[4px] decoration-[1px] hover:text-white md:border-r-[2px] border-r-gray-300 hoverEffect last:border-r-0"
                            onClick={() => setSidenav(false)}
                          >
                            <Link to="/signup">Register</Link>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <MdClose
                    className="w-8 h-8 absolute top-6 right-6 cursor-pointer"
                    onClick={() => setSidenav(false)}
                  />
                </motion.div>
              </div>
            )}
          </div>
        </Flex>
      </nav>
    </div>
  );
};


export default Header;
