import React from 'react';

const OrderDetail = ({ orderData }) => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#e6be8a', borderBottom: '2px solid #e6be8a', paddingBottom: '10px' }}>Order Details</h2>
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {orderData.map((order) => (
          <li key={order.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e6be8a', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
            <p style={{ margin: '5px 0' }}><strong>Order ID:</strong> <span style={{ color: '#555' }}>{order.id}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Customer ID:</strong> <span style={{ color: '#555' }}>{order.customerId}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Order Date:</strong> <span style={{ color: '#555' }}>{new Date(order.orderDate).toLocaleString()}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Status:</strong> <span style={{ color: '#555' }}>{order.status}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Order Amount:</strong> <span style={{ color: '#555' }}>₹{order.orderAmount}</span></p>
            <p style={{ margin: '5px 0' }}><strong>Order Date:</strong> <span style={{ color: '#555' }}>{order.orderDate}</span></p>
            <ul style={{ listStyleType: 'none', paddingLeft: '20px', borderTop: '1px solid #e6be8a', marginTop: '10px', paddingTop: '10px' }}>
              {order.items.map((item) => (
                <li key={item.orderItemId} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #e6be8a', borderRadius: '5px', backgroundColor: '#ffffff' }}>
                  <p style={{ margin: '5px 0' }}><strong>Product ID:</strong> <span style={{ color: '#555' }}>{item.productId}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Product Name:</strong> <span style={{ color: '#555' }}>{item.name}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Quantity:</strong> <span style={{ color: '#555' }}>{item.quantity}</span></p>
                  <p style={{ margin: '5px 0' }}><strong>Price:</strong> <span style={{ color: '#555' }}>₹{item.price}</span></p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetail;
