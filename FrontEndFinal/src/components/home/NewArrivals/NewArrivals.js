// import React, { useState, useEffect } from "react";
// import Slider from "react-slick";
// import Heading from "../Products/Heading";
// import SampleNextArrow from "./SampleNextArrow";
// import SamplePrevArrow from "./SamplePrevArrow";
// import axios from 'axios';
// import './NewArrival.css'; // Import the CSS file

// const NewArrivals = () => {
//   const [products, setProducts] = useState([]);
  
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('https://api.baazaarplus.xyz/api/products/product');
//         setProducts(response.data);
//       } catch (error) {
//         console.error('Error fetching new arrivals:', error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const settings = {
//     infinite: true,
//     speed: 500,
//     slidesToShow: 4,
//     slidesToScroll: 1,
//     nextArrow: <SampleNextArrow />,
//     prevArrow: <SamplePrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1025,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//           infinite: true,
//         },
//       },
//       {
//         breakpoint: 769,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           infinite: true,
//         },
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: true,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="new-arrivals-container">
//       <Heading heading="New Arrivals" />
//       <Slider {...settings}>
//         {products.map(product => (
//           <div key={product.id} className="product-card">
//             <div className="product-image-container">
//               <img className="product-image" src={product.image} alt={product.name} />
//             </div>
//             <div className="product-details">
//               <h3>{product.name}</h3>
//               <p>{product.description}</p>
//               <p>Price: {product.price}</p>
//               <p>Color: {product.category.name}</p>
//             </div>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default NewArrivals;

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";
import axios from 'axios';
import './NewArrival.css'; // Import the CSS file

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://api.baazaarplus.xyz/api/products/product');
        setProducts(response.data.sort((a,b)=>{
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateB-dateA;
        }).slice(0,11));
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setError('Failed to fetch new arrivals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1025,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="new-arrivals-container">
      <Heading heading="New Arrivals" />
      <Slider {...settings}>
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img className="product-image" src={product.image} alt={product.name} />
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>Price: {product.price}</p>
              <p>Category: {product.category.name}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewArrivals;

