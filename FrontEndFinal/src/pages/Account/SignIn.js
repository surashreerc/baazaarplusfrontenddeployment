import React, { useState, useContext } from 'react';
import axios from 'axios';
import { logo } from '../../assets/images';
import { UserContext } from '../../UserContext';
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode correctly
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons


const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const { setUserRole, setUserEmail } = useContext(UserContext);
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator
    try {
      const response = await axios.post('http://13.200.241.188:9090/api/auth/signin', {
        email,
        password
      });
 
      const token = response.data.accessToken;
      localStorage.setItem('token', token);
 
      const decodedToken = jwtDecode(token);
 
      // Fetch user details with the token
      const userResponse = await axios.get('http://13.200.241.188:9090/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
     
      const user = userResponse.data.find(user => user.email === email);
      const userRole = user.roles.map(role => role.name)[0];
     
      setUserRole(userRole);
      setUserEmail(email);


      // Store user role and email in localStorage
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userEmail', email);
 
      setSuccess('Login successful');
      setError('');
      setLoading(false); // End loading indicator


      // Show alert
      alert('Login successful');


      // Redirect to home page
      navigate('/');
     
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError('Login failed. Please check your credentials and try again.');
      setSuccess('');
      setLoading(false); // End loading indicator
    }
  };


  return (
    <div>
      <Header />
      <div className="flex h-screen">
        <div className="hidden md:flex flex-col w-1/3 bg-[#e6be8a] items-center justify-center p-4">
          <img src={logo} alt="Baazaar Logo" className="w-32 mb-4" />
          <h1 className="font-titleFont text-xl font-medium text-white mb-4">Join us to know more...</h1>
          <img
            src="https://images.pexels.com/photos/5650016/pexels-photo-5650016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Join us"
            className="rounded-md"
          />
        </div>


        <div className="flex-grow flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
            <h2 className="font-titleFont underline underline-offset-4 decoration-[1px] font-semibold text-3xl mdl:text-4xl mb-4 text-center">Login</h2>
            {error && <p className="error text-red-500 mb-4">{error}</p>}
            {success && <p className="success text-green-500 mb-4">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#e6be8a] text-white rounded px-4 py-2 w-full hover:bg-indigo-700 transition duration-300"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Loading...' : 'Login'} {/* Show loading indicator */}
              </button>
              <div className="text-center mt-4">
                <Link to="/forgotpassword" className="text-blue-500">Forgot Password?</Link>
              </div>
              <div className="text-center mt-4">
                <p>Not Registered till Now? <Link to="/signup" className="text-blue-500">Register Now!</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default SignIn;