import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto
export const CartContext = createContext();

// Hook para usar el contexto del carrito
export const useCartContext = () => {
  return useContext(CartContext);
};

// Proveedor del contexto del carrito
export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Estado del carrito
  const [cartItemCount, setCartItemCount] = useState(0); // Estado para el contador

  // Función para añadir productos al carrito o incrementar su cantidad
  // Ejemplo de cómo agregar un producto al carrito
const addToCart = (product) => {
  setCart(prevCart => {
    const existingItem = prevCart.find(item => item._id === product._id);
    if (existingItem) {
      return prevCart.map(item => 
        item._id === product._id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    } else {
      return [...prevCart, { ...product, quantity: 1 }];
    }
  });

  // Si usas Redux, despacha una acción para agregar el producto al estado
  dispatch(addProductToCart(product)); // Asegúrate de que esta acción actualice el estado correctamente
};

  // Función para eliminar productos del carrito o decrementar su cantidad
  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find(item => item._id === productId);
      if (existingProduct && existingProduct.quantity > 1) {
        return prevCart.map(item =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 } // Decrementar cantidad
            : item
        );
      } else {
        return prevCart.filter(item => item._id !== productId); // Eliminar producto
      }
    });
  };

  // Función para vaciar el carrito completo
  const clearCart = () => {
    setCart([]);
  };

  // Actualizar el contador de productos cuando cambia el carrito
  useEffect(() => {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemCount(totalItems);
    {/*console.log("Total de productos en el carrito:", totalItems); */}
 
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartItemCount, // Cantidad total de productos en el carrito
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
