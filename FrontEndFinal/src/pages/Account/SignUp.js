import React, { useState } from 'react';
import axios from 'axios';
import { logo } from '../../assets/images';
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer'; // Adjust the import path as needed
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Signup, Step 2: OTP Verification
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [loading, setLoading] = useState(false); // State for loading indicator


  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator
    try {
      const response = await axios.post('https://api.baazaarplus.xyz/api/auth/signup', {
        username,
        email,
        password
      });
      console.log('Signup successful:', response.data);
      setSuccess('Signup successful. Please check your email for the OTP.');
      setError('');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Signup failed. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false); // End loading indicator
    }
  };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://api.baazaarplus.xyz/api/auth/verify-otp', {
        email,
        otp
      });
      console.log('OTP verification successful:', response.data);
      setSuccess('OTP verification successful. You can now sign in.');
      setError('');
      // Redirect to SignIn after successful OTP verification
      window.location.href = 'https://baazaarplus.xyz/signin';
    } catch (err) {
      console.error('OTP verification failed:', err);
      setError('OTP verification failed. Please try again.');
      setSuccess('');
    }
  };


  return (
    <div>
      <Header />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-1/3 bg-[#e6be8a] items-center justify-center p-4">
          <img src={logo} alt="Baazaar Logo" className="w-32 mb-4" />
          <h1 className="font-titleFont text-xl font-medium text-white mb-4">Join us to know more...</h1>
          <img
            src="https://images.pexels.com/photos/5650016/pexels-photo-5650016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Join us"
            className="rounded-md"
          />
        </div>


        {/* Signup and OTP Form */}
        <div className="flex-grow flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            {step === 1 ? (
              <>
                <h2 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4 text-center">Sign Up</h2>
                {error && <p className="error text-red-500 mb-4">{error}</p>}
                {success && <p className="success text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="username" className="text-gray-700">Name:</label>
                    <input
                      id="username"
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-gray-700">Email:</label>
                    <input
                      id="email"
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2 relative">
                    <label htmlFor="password" className="text-gray-700">Password:</label>
                    <div className="relative">
                      <input
                        id="password"
                        className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
                        onClick={() => setShowPassword(prev => !prev)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#e6be8a] text-white rounded px-4 py-2 w-full hover:bg-indigo-700 transition duration-300"
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? 'Loading...' : 'Sign Up'} {/* Show loading indicator */}
                  </button>
                  <p className="text-center text-gray-600 mt-4">
                    Already Registered? <Link to="/signin" className="text-blue-500 hover:underline">Login Now</Link>
                  </p>
                </form>
              </>
            ) : (
              <>
                <h2 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4 text-center">Verify OTP</h2>
                {error && <p className="error text-red-500 mb-4">{error}</p>}
                {success && <p className="success text-green-500 mb-4">{success}</p>}
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="otp" className="text-gray-700">OTP:</label>
                    <input
                      id="otp"
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="bg-[#e6be8a] text-white rounded px-4 py-2 w-full hover:bg-indigo-700 transition duration-300">
                    Verify OTP
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default SignUp;