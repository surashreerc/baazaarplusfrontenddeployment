import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Header from '../../components/home/Header/Header';
import Footer from '../../components/home/Footer/Footer';
import { UserContext } from '../../UserContext'; // Import UserContext from where it's defined
import './profile.css';

const Profile = () => {
  const { userEmail } = useContext(UserContext); // Access userEmail from the context
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    userId: '',
    line1: '',
    line2: '',
    state: '',
    pincode: ''
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  const fetchUserAddress = async () => {
    if (user) {
      try {
        const token = localStorage.getItem('token');
        const userResponse = await axios.get('http://localhost:8087/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const loggedInUser = userResponse.data.find(userItem => userItem.email === userEmail); // Use userEmail from context

        if (!loggedInUser) {
          setError('User not found.');
          return;
        }

        const userId = loggedInUser.id;

        const addressResponse = await axios.get(`http://localhost:8087/api/addresses/user/${userId}`);
        setAddress(addressResponse.data[0]); // Assuming the first address is the user's address
        setFormData({
          userId: userId,
          line1: addressResponse.data[0]?.line1 || '',
          line2: addressResponse.data[0]?.line2 || '',
          state: addressResponse.data[0]?.state || '',
          pincode: addressResponse.data[0]?.pincode || ''
        });
      } catch (err) {
        setError('Failed to fetch user address. Please try again later.');
        console.error('Error fetching user address:', err);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8087/api/auth/users');
        const loggedInUser = response.data.find(userItem => userItem.email === userEmail); // Use userEmail from context
        setUser(loggedInUser);
        setFormData((prevFormData) => ({ ...prevFormData, userId: loggedInUser.id }));
      } catch (err) {
        setError('Failed to fetch user data. Please try again later.');
        console.error('Error fetching user:', err);
      }
    };

    fetchUserData();
  }, [userEmail]); // Trigger useEffect when userEmail changes

  useEffect(() => {
    fetchUserAddress();
  }, [user]);

  const handleAddOrUpdateAddress = () => {
    setShowAddressForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (address) {
        // Update existing address
        await axios.put(`http://localhost:8087/api/addresses/address/update/${address.addressId}`, {
          line1: formData.line1,
          line2: formData.line2,
          state: formData.state,
          pincode: formData.pincode
        });
      } else {
        // Add new address
        await axios.post('http://localhost:8087/api/addresses/address/add', formData);
      }
      fetchUserAddress();
      setShowAddressForm(false); // Reset the state after successfully adding or updating the address
    } catch (err) {
      setError('Failed to add or update address. Please try again later.');
      console.error('Error adding or updating address:', err);
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleCancel = () => {
    setShowAddressForm(false); // Hide the form when "Cancel" is clicked
  };

  return (
    <div className='profile'>
      <Header />
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-image-container">
            <img src="https://cdn-icons-png.flaticon.com/512/10337/10337609.png" alt="Profile Icon" className="profile-icon" />
            <div className="profile-info">
              <h2 className='he'>Your Information:</h2>
              <p>Username: {user && user.username}</p>
              <p>Email: {user && user.email}</p>
              <h2 className='he'>Your Address:</h2>
              {address ? (
                <>
                  <p>Full Address: {address.line1}</p>
                  <p>City: {address.line2}</p>
                  <p>State: {address.state}</p>
                  <p>Pincode: {address.pincode}</p>
                  <button onClick={handleAddOrUpdateAddress}>Update Address</button>
                </>
              ) : (
                <p>No address available. {!showAddressForm && <button onClick={handleAddOrUpdateAddress}>Add Address</button>}</p>
              )}
            </div>
          </div>
          <div className="profile-actions">
            {showAddressForm && (
              <form onSubmit={handleSubmit}>
                <label>
                  Full Address:
                  <input type="text" name="line1" value={formData.line1} onChange={handleChange} />
                </label>
                <label>
                  City:
                  <input type="text" name="line2" value={formData.line2} onChange={handleChange} />
                </label>
                <label>
                  State:
                  <input type="text" name="state" value={formData.state} onChange={handleChange} />
                </label>
                <label>
                  Pincode:
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} />
                </label>
                <button type="submit" className='addresssub'>Submit</button><br></br>
                <button type="button" className='addresscan' onClick={handleCancel}>Cancel</button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
