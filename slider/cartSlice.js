import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingProduct = state.items.find(item => item._id === product._id);
      if (existingProduct) {
        existingProduct.quantity += 1;  // Incrementa la cantidad
      } else {
        state.items.push({ ...product, quantity: 1 });  // Agrega el producto con cantidad 1
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      const existingProduct = state.items.find(item => item._id === productId);

      if (existingProduct) {
        if (existingProduct.quantity > 1) {
          existingProduct.quantity -= 1;  // Disminuir la cantidad
        } else {
          state.items = state.items.filter(item => item._id !== productId);  // Remover el producto si la cantidad es 1
        }
      }
    },
    // Otras acciones como emptyCart, etc.
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions; // Exporta removeFromCart
export default cartSlice.reducer;
