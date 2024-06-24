import { createSlice } from '@reduxjs/toolkit';

const orebiSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
  },
  reducers: {
    addToCart: (state, action) => {
      state.cartItems.push(action.payload);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
    },
    // Other reducers
    deleteItem: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.productId !== action.payload);
    },
    drecreaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.productId === action.payload);
      if (item) item.quantity -= 1;
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(item => item.productId === action.payload);
      if (item) item.quantity += 1;
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

export const { addToCart, removeFromCart, deleteItem, drecreaseQuantity, increaseQuantity, resetCart, toggleBrand, toggleCategory } = orebiSlice.actions;

export default orebiSlice.reducer;
