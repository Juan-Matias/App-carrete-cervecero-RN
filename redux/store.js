import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../slider/cartSlice.js'; 

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
});
