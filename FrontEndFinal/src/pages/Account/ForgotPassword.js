import React, { useState } from 'react';
import axios from 'axios';
import { logo } from '../../assets/images';
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stage, setStage] = useState('email'); // stages: 'email', 'reset'
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator
    try {
      await axios.post('http://localhost:8087/api/auth/send-otp', { email });
      setSuccess('OTP has been sent to your email.');
      setError('');
      setStage('reset');
    } catch (err) {
      setError('OTP request failed. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false); // End loading indicator
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true); // Start loading indicator
    try {
      await axios.post('http://localhost:8087/api/auth/reset-password', { email, otp, newPassword });
      setSuccess('Password reset successful. You can now sign in.');
      setError('');
      setStage('email');
      window.location.href = 'http://localhost:3000/signin';
    } catch (err) {
      setError('Incorrect OTP.');
      setSuccess('');
    } finally {
      setLoading(false); // End loading indicator
    }
  };

  return (
    <div>
      <Header />
      <div className="flex h-screen">
        <div className="hidden md:flex flex-col w-1/3 bg-[#e6be8a] items-center justify-center p-4">
          <img src={logo} alt="Logo" className="w-32 mb-4" />
          <h1 className="font-titleFont text-xl font-medium text-white mb-4">Reset your password...</h1>
        </div>
        <div className="flex-grow flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h2 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4 text-center">Forgot Password</h2>
            {error && <p className="error text-red-500 mb-4">{error}</p>}
            {success && <p className="success text-green-500 mb-4">{success}</p>}
            
            {stage === 'email' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                <button 
                  type="submit" 
                  className="bg-[#e6be8a] text-white rounded px-4 py-2 w-full hover:bg-indigo-700 transition duration-300"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? 'Loading...' : 'Send OTP'} {/* Show loading indicator */}
                </button>
              </form>
            )}

            {stage === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
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
                <div className="flex flex-col gap-2">
                  <label htmlFor="newPassword" className="text-gray-700">New Password:</label>
                  <input
                    id="newPassword"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmPassword" className="text-gray-700">Confirm Password:</label>
                  <input
                    id="confirmPassword"
                    className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="bg-[#e6be8a] text-white rounded px-4 py-2 w-full hover:bg-indigo-700 transition duration-300"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? 'Loading...' : 'Reset Password'} {/* Show loading indicator */}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassword;
