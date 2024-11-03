export const clearCart = () => ({
    type: 'CLEAR_CART'
  });
  
  // reducer/cartReducer.js
  const initialState = {
    items: [],
  };
  
  const cartReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'CLEAR_CART':
        return {
          ...state,
          items: [], // Limpiar los artículos del carrito
        };
      // otros casos...
      default:
        return state;
    }
  };
  