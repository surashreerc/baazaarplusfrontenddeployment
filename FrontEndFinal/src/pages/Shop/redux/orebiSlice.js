import { createSlice } from '@reduxjs/toolkit';

const orebiSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      // Check if the product already exists in the cart
      const existingProductIndex = state.cartItems.findIndex(item => item.productId === action.payload.productId);

      if (existingProductIndex !== -1) {
        // If the product already exists, update its quantity
        state.cartItems[existingProductIndex].quantity += action.payload.quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        state.cartItems.push(action.payload);
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
    },
    deleteItem: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.productId === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.productId === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    resetCart: (state) => {
      state.cartItems = [];
    },
    toggleBrand: (state, action) => {
      // Implementation
    },
    toggleCategory: (state, action) => {
      // Implementation
    },
  },
});

export const { addToCart, removeFromCart, deleteItem, decreaseQuantity, increaseQuantity, resetCart, toggleBrand, toggleCategory } = orebiSlice.actions;

export default orebiSlice.reducer;
