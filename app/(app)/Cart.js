import React, { useState, useEffect } from "react";
import { View, Image, Text, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux"; // Importa useDispatch y useSelector

import { clearCart } from "../../hooks/CartContext/useCartAction.js"; // Importa la acción clearCart
import Facturacion from "../../components/factura/Facturacion.js";
import CardCarrito from "../../components/cart/CardCarrito.js";
import { useAuth } from "../../context/authContext.js";
const Carrito = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch(); // Crea un dispatcher para Redux
  const cart = useSelector((state) => state.cart.items); // Obtén los ítems del carrito desde Redux
  const [isModalVisible, setModalVisible] = useState(false);
  const { user } = useAuth();
  const handleSignIn = () => {
    navigation.navigate("Products");
  };

  const total = cart.reduce((sum, item) => {
    const itemPrice = item.price * item.quantity;
    const itemDiscount = user && !user.isAnonymous ? item.Descuento || 0 : 0; // Aplica descuento solo si el usuario está autenticado
    return sum + itemPrice * (1 - itemDiscount); // Aplica el descuento de cada artículo
  }, 0);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Función que se ejecuta cuando se finaliza la compra
  const handleCompraFinalizada = () => {
    dispatch(clearCart()); // Despacha la acción para limpiar el carrito
    closeModal(); // Cierra el modal
  };

  useEffect(() => {
    if (cart.length === 0) {
      setModalVisible(false); // Cierra el modal si el carrito está vacío
    }
  }, [cart]);

  return (
    <View className="flex-1 p-4 bg-white">
      {cart.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require("../../assets/imagen-mascota/Cerveza-carrito.png")}
            className="w-72 h-72"
            resizeMode="contain"
          />
          <Text className="mt-4 text-lg font-semibold text-gray-700 text-center">
            ¡Mmmmmmm! Parece que aún no añades ningún pedido a tu carrito.
          </Text>
          <Button
            mode="contained"
            onPress={handleSignIn}
            className="mt-6 bg-amber-500 rounded-lg"
            labelStyle={{ color: "white" }}
          >
            Añadir barriles
          </Button>
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={cart}
            renderItem={({ item }) => <CardCarrito item={item} />}
            keyExtractor={(item) =>
              item._id ? item._id.toString() : `${item.id}`
            }
          />
          <Button
            mode="contained"
            className="mt-4 bg-amber-500 rounded-lg"
            labelStyle={{ color: "white" }}
            onPress={openModal}
          >
            Reservar
          </Button>

          <Facturacion
            isVisible={isModalVisible}
            onClose={closeModal}
            cart={cart}
            total={total}
            onCompraFinalizada={handleCompraFinalizada} // Ejecuta esta función cuando se finaliza la compra
          />
        </View>
      )}
    </View>
  );
};

export default Carrito;
