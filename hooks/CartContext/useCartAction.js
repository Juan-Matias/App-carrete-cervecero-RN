export const clearCart = () => ({
  type: "CLEAR_CART",
});

const initialState = {
  items: [], // Lista inicial de artículos vacía
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CLEAR_CART":
      return {
        ...state,
        items: [], // Limpiar los artículos del carrito
      };
    // Otros casos pueden ir aquí...
    default:
      return state;
  }
};
