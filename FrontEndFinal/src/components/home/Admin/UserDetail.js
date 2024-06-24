import React from 'react';

const UserDetail = ({ userData }) => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#e6be8a', borderBottom: '2px solid #e6be8a', paddingBottom: '10px' }}>User Details</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {userData.map((user) => (
          <li key={user.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e6be8a', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <p style={{ margin: '5px 0' }}><strong>ID:</strong> <span style={{ color: '#555' }}>{user.id}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Username:</strong> <span style={{ color: '#555' }}>{user.username}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> <span style={{ color: '#555' }}>{user.email}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Roles:</strong> <span style={{ color: '#555' }}>{user.roles.map(role => role.name).join(', ')}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Addresses:</strong></p>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {user.addresses.map(address => (
                <li key={address.addressId}>
                  <p style={{ margin: '5px 0' }}><strong>Address ID:</strong> <span style={{ color: '#555' }}>{address.addressId}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Line 1:</strong> <span style={{ color: '#555' }}>{address.line1}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Line 2:</strong> <span style={{ color: '#555' }}>{address.line2}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>State:</strong> <span style={{ color: '#555' }}>{address.state}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Pincode:</strong> <span style={{ color: '#555' }}>{address.pincode}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Created At:</strong> <span style={{ color: '#555' }}>{new Date(address.createdAt).toLocaleString()}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Updated At:</strong> <span style={{ color: '#555' }}>{new Date(address.updatedAt).toLocaleString()}</span></p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetail;
