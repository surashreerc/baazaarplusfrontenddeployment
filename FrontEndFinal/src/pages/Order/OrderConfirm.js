import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "./order.css";


const OrderConfirm = () => {
  const { userEmail } = useContext(UserContext);
  const [error, setError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [orderDetails, setOrderDetails] = useState(null);
  const [cartDetails, setCartDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  useEffect(() => {
    initializeOrderProcess();
  }, [userEmail]);


  const fetchUser = async () => {
    try {
      const userResponse = await axios.get('https://api.baazaarplus.xyz/api/auth/users');
      const user = userResponse.data.find(user => user.email === userEmail);
      setUserInfo(user);
      return user;
    } catch (err) {
      setError('Failed to fetch user data. Please try again later.');
      console.error('Error fetching user:', err);
      return null;
    }
  };


  const fetchCartDetails = async (userId) => {
    try {
      const response = await axios.get(`https://api.baazaarplus.xyz/carts/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });


      const cartItems = response.data.cartItems;
      let totalAmount = 0;


      cartItems.forEach(item => {
        totalAmount += item.quantity * item.price;
      });


      setCartDetails({
        ...response.data,
        totalAmount: totalAmount
      });


      return {
        ...response.data,
        totalAmount: totalAmount
      };
    } catch (err) {
      console.error('Error fetching cart details:', err);
      return null;
    }
  };


  const fetchUserAddress = async (userId) => {
    try {
      const response = await axios.get(`https://api.baazaarplus.xyz/api/addresses/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      console.error('Error fetching user address:', err);
      return [];
    }
  };


  const initializeOrderProcess = async () => {
    const user = await fetchUser();
    if (user) {
      console.log('User fetched:', user);
      const cartDetails = await fetchCartDetails(user.id);
      if (cartDetails && cartDetails.cartItems.length > 0) {
        const addresses = await fetchUserAddress(user.id);
        console.log('Addresses fetched:', addresses);
        if (addresses.length > 0) {
          setUserInfo(user);
        } else {
          setError('Address is not present. Please add an address in your Profile.');
        }
      } else {
        setError('Your cart is empty. Please add items to your cart before placing an order.');
      }
    }
  };


  const handleRazorpayPayment = async () => {
    setLoading(true);
    const userId = userInfo.id;
    const addresses = await fetchUserAddress(userId);
    if (addresses.length === 0) {
      setError('No address found for the user.');
      setLoading(false);
      return;
    }
    const addressId = addresses[0].addressId;


    const cartDetails = await fetchCartDetails(userId);
    if (!cartDetails) {
      setError('Failed to fetch cart details. Please try again later.');
      setLoading(false);
      return;
    }
    const paymentAmount = cartDetails.totalAmount * 100;


    try {
      const response = await axios.post(
        "https://api.baazaarplus.xyz/api/orders/create-razorpay-order",
        { amount: paymentAmount },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );


      const { id: order_id, amount } = response.data;


      const options = {
        key: "rzp_test_LU7mA53kjBBlCS",
        amount: amount,
        currency: "INR",
        name: "Baazaarplus",
        description: `Order Payment`,
        order_id: order_id,
        handler: async function (response) {
          try {
            const paymentDataToSend = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              paymentAmount: amount
            };


            setPaymentDetails(paymentDataToSend);
            await savePaymentDetails(paymentDataToSend);
            await placeOrder(userId, addressId, paymentDataToSend);


            toast.success("Payment Successful!!!", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });


            setPaymentSuccess(true);
          } catch (error) {
            console.error("Payment failed!", error);
            toast.error("Payment failed!", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        },
        prefill: {
          name: userInfo.username,
          email: userEmail,
          contact: userInfo.contact,
        },
        notes: {
          address: "Order for user",
        },
        theme: {
          color: "#3399cc",
        },
      };


      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      toast.error("Error creating Razorpay order!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };


  const savePaymentDetails = async (paymentData) => {
    try {
      await axios.post("https://api.baazaarplus.xyz/api/orders/save", paymentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Error saving payment details:", error);
      toast.error("Error saving payment details!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };


  const placeOrder = async (userId, addressId, paymentDetails) => {
    try {
      const orderResponse = await axios.post('https://api.baazaarplus.xyz/api/orders', {
        customerId: userId,
        addressId: addressId,
        paymentDetails: paymentDetails
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderDetails(orderResponse.data);
    } catch (err) {
      setError('Failed to place order. Please try again later.');
      console.error('Error placing order:', err);
    }
  };


  const closePopupAndRedirect = () => {
    setPaymentSuccess(false);
    navigate('/');
  };


  return (
    <div>
      <Header />
      <div className='order'>
        <div className="order-container">
          {cartDetails && (
            <div className="cart-details">
              <h1>Please Confirm to Order</h1>
              <h3>Items:</h3>
              <ul>
                {cartDetails.cartItems.map(item => (
                  <li key={item.orderItemId}>
                    {item.name} - Quantity: {item.quantity} - Price: ₹{item.price}
                  </li>
                ))}
                <li>Total Amount: ₹{cartDetails.totalAmount}</li>
              </ul>
            </div>
          )}


          {error && <p className="error">{error}</p>}
          {userInfo && (
            <div>
              <h3>Your Information:</h3>
              <p>Username: {userInfo.username}</p>
              <p>Email: {userInfo.email}</p>
              {userInfo.addresses && userInfo.addresses.length > 0 ? (
                <div>
                  <h3>Your Address:</h3>
                  {userInfo.addresses.map((addr, index) => (
                    <div key={index}>
                      <p>Full Address: {addr.line1}</p>
                      <p>City: {addr.line2}</p>
                      <p>State: {addr.state}</p>
                      <p>Pincode: {addr.pincode}</p>
                    </div>
                  ))}
                  <button className="update-address-btn" onClick={() => navigate('/profile')}>Update Address</button>
                </div>
              ) : (
                <div>
                  <p>No Address Found</p>
                  <button className="add-address-btn" onClick={() => navigate('/profile')}>Add Address</button>
                </div>
              )}
            </div>
          )}
          <button className="proceed-to-checkout-btn" onClick={handleRazorpayPayment} disabled={loading}>
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
        {paymentSuccess && (
          <div className="popup">
            <div className="popup-content">
              <h2>Payment Successful</h2>
              <p>Payment ID: {paymentDetails.razorpay_payment_id}</p>
              <p>Order ID: {orderDetails.id}</p>
              <p>Order Date: {orderDetails.orderDate && new Date(orderDetails.orderDate).toLocaleString()}</p>
              <button onClick={closePopupAndRedirect}>Close</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};


export default OrderConfirm;


// import React, { useEffect, useContext, useState } from 'react';
// import axios from 'axios';
// import { UserContext } from '../../UserContext';
// import Header from '../../components/home/Header/Header';
// import Footer from '../../components/home/Footer/Footer';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import "./order.css";

// const OrderConfirm = () => {
//   const { userEmail } = useContext(UserContext);
//   const [error, setError] = useState('');
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [paymentDetails, setPaymentDetails] = useState({});
//   const [userInfo, setUserInfo] = useState({});
//   const [orderDetails, setOrderDetails] = useState(null);
//   const [cartDetails, setCartDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     initializeOrderProcess();
//   }, [userEmail]);

//   const fetchUser = async () => {
//     try {
//       const userResponse = await axios.get('https://api.baazaarplus.xyz/api/auth/users');
//       const user = userResponse.data.find(user => user.email === userEmail);
//       setUserInfo(user);
//       return user;
//     } catch (err) {
//       setError('Failed to fetch user data. Please try again later.');
//       console.error('Error fetching user:', err);
//       return null;
//     }
//   };

//   const fetchCartDetails = async (userId) => {
//     try {
//       const response = await axios.get(`https://api.baazaarplus.xyz/carts/cart/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const cartItems = response.data.cartItems;
//       let totalAmount = 0;

//       cartItems.forEach(item => {
//         totalAmount += item.quantity * item.price;
//       });

//       setCartDetails({
//         ...response.data,
//         totalAmount: totalAmount
//       });

//       return {
//         ...response.data,
//         totalAmount: totalAmount
//       };
//     } catch (err) {
//       console.error('Error fetching cart details:', err);
//       return null;
//     }
//   };

//   const fetchUserAddress = async (userId) => {
//     try {
//       const response = await axios.get(`https://api.baazaarplus.xyz/api/addresses/user/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (err) {
//       console.error('Error fetching user address:', err);
//       return [];
//     }
//   };

//   const initializeOrderProcess = async () => {
//     const user = await fetchUser();
//     if (user) {
//       console.log('User fetched:', user);
//       const cartDetails = await fetchCartDetails(user.id);
//       if (cartDetails && cartDetails.cartItems.length > 0) {
//         const addresses = await fetchUserAddress(user.id);
//         console.log('Addresses fetched:', addresses);
//         if (addresses.length > 0) {
//           setUserInfo(user);
//         } else {
//           setError('Address is not present. Please add an address in your Profile.');
//         }
//       } else {
//         setError('Your cart is empty. Please add items to your cart before placing an order.');
//       }
//     }
//   };

//   const handleRazorpayPayment = async () => {
//     setLoading(true);
//     const userId = userInfo.id;
//     const addresses = await fetchUserAddress(userId);
//     if (addresses.length === 0) {
//       setError('No address found for the user.');
//       setLoading(false);
//       return;
//     }
//     const addressId = addresses[0].addressId;

//     const cartDetails = await fetchCartDetails(userId);
//     if (!cartDetails) {
//       setError('Failed to fetch cart details. Please try again later.');
//       setLoading(false);
//       return;
//     }
//     const paymentAmount = cartDetails.totalAmount * 100;

//     try {
//       const response = await axios.post(
//         "https://api.baazaarplus.xyz/api/orders/create-razorpay-order",
//         { amount: paymentAmount },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       const { id: order_id, amount } = response.data;

//       const options = {
//         key: "rzp_test_LU7mA53kjBBlCS",
//         amount: amount,
//         currency: "INR",
//         name: "Baazaarplus",
//         description: `Order Payment`,
//         order_id: order_id,
//         handler: async function (response) {
//           try {
//             // Fetch Razorpay payment details using payment ID
//             const paymentDetailsResponse = await axios.get(
//               `https://api.razorpay.com/v1/payments/${response.razorpay_payment_id}`,
//               {
//                 auth: {
//                   username: 'rzp_test_LU7mA53kjBBlCS', // Use your Razorpay key ID here
//                   password: '5hg2L1O1ioITtoAO2rykQLtW' // Use your Razorpay secret key here
//                 }
//               }
//             );

//             // Extract payment method from payment details
//             const paymentMode = paymentDetailsResponse.data.method;

//             // Include paymentMode in paymentDataToSend
//             const paymentDataToSend = {
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_signature: response.razorpay_signature,
//               paymentAmount: amount / 100, // Convert back to the original amount
//               paymentMode: paymentMode // Extract payment mode from Razorpay response
//             };

//             setPaymentDetails(paymentDataToSend);
//             await savePaymentDetails(paymentDataToSend);
//             await placeOrder(userId, addressId, paymentDataToSend);

//             toast.success("Payment Successful!!!", {
//               position: "top-center",
//               autoClose: 2000,
//               hideProgressBar: false,
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//             });

//             setPaymentSuccess(true);
//           } catch (error) {
//             console.error("Payment failed!", error);
//             toast.error("Payment failed!", {
//               position: "top-center",
//               autoClose: 2000,
//               hideProgressBar: false,
//               closeOnClick: true,
//               pauseOnHover: true,
//               draggable: true,
//             });
//           }
//         },
//         prefill: {
//           name: userInfo.username,
//           email: userEmail,
//           contact: userInfo.contact,
//         },
//         notes: {
//           address: "Order for user",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (error) {
//       console.error("Error creating Razorpay order:", error);
//       toast.error("Error creating Razorpay order!", {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const savePaymentDetails = async (paymentData) => {
//     try {
//       await axios.post("https://api.baazaarplus.xyz/api/orders/save", paymentData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//     } catch (error) {
//       console.error("Error saving payment details:", error);
//       toast.error("Error saving payment details!", {
//         position: "top-center",
//         autoClose: 2000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//       });
//     }
//   };

//   const placeOrder = async (userId, addressId, paymentDetails) => {
//     try {
//       const orderResponse = await axios.post('https://api.baazaarplus.xyz/api/orders', {
//         customerId: userId,
//         addressId: addressId,
//         paymentDetails: paymentDetails
//       }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setOrderDetails(orderResponse.data);
//     } catch (err) {
//       setError('Failed to place order. Please try again later.');
//       console.error('Error placing order:', err);
//     }
//   };

//   const closePopupAndRedirect = () => {
//     setPaymentSuccess(false);
//     navigate('/');
//   };

//   return (
//     <div>
//       <Header />
//       <div className='order'>
//         <div className="order-container">
//           {cartDetails && (
//             <div className="cart-details">
//               <h1>Please Confirm to Order</h1>
//               <h3>Items:</h3>
//               <ul>
//                 {cartDetails.cartItems.map(item => (
//                   <li key={item.orderItemId}>
//                     {item.name} - Quantity: {item.quantity} - Price: ₹{item.price}
//                   </li>
//                 ))}
//                 <li>Total Amount: ₹{cartDetails.totalAmount}</li>
//               </ul>
//             </div>
//           )}

//           {error && <p className="error">{error}</p>}
//           {userInfo && (
//             <div>
//               <h3>Your Information:</h3>
//               <p>Username: {userInfo.username}</p>
//               <p>Email: {userInfo.email}</p>
//               {userInfo.addresses && userInfo.addresses.length > 0 ? (
//                 <div>
//                   <h3>Your Address:</h3>
//                   {userInfo.addresses.map((addr, index) => (
//                     <div key={index}>
//                       <p>Full Address: {addr.line1}</p>
//                       <p>City: {addr.line2}</p>
//                       <p>State: {addr.state}</p>
//                       <p>Pincode: {addr.pincode}</p>
//                     </div>
//                   ))}
//                   <button className="update-address-btn" onClick={() => navigate('/profile')}>Update Address</button>
//                 </div>
//               ) : (
//                 <div>
//                   <p>No Address Found</p>
//                   <button className="add-address-btn" onClick={() => navigate('/profile')}>Add Address</button>
//                 </div>
//               )}
//             </div>
//           )}
//           <button className="proceed-to-checkout-btn" onClick={handleRazorpayPayment} disabled={loading}>
//             {loading ? "Processing..." : "Proceed to Payment"}
//           </button>
//         </div>
//         {paymentSuccess && (
//           <div className="popup">
//             <div className="popup-content">
//               <h2>Payment Successful</h2>
//               <p>Payment ID: {paymentDetails.razorpay_payment_id}</p>
//               <p>Order ID: {orderDetails.id}</p>
//               <p>Order Date: {orderDetails.orderDate && new Date(orderDetails.orderDate).toLocaleString()}</p>
//               <button onClick={closePopupAndRedirect}>Close</button>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default OrderConfirm;
