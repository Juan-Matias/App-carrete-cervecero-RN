// CardCarrito.js
import React from "react";
import { View, Image, Text, TouchableOpacity, Button } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { addToCart, removeFromCart } from "../../slider/cartSlice.js";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { useCartContext } from "../../hooks/CartContext/useCartContext.js";
import { useAuth } from "../../context/authContext.js";
// Tamaño de la imagen
const imageWidth = wp(54);
const imageHeight = hp(17);

const CardCarrito = ({ item }) => {
  const dispatch = useDispatch();
  const { clearCart } = useCartContext(); // Desestructurar la función clearCart desde el contexto
  const { user } = useAuth();
  return (
    <View
      className="m-2 p-2 rounded-lg bg-gray-50 flex-row items-center"
      style={{ height: hp(15) }}
    >
      {/* Imagen del producto */}
      <Image
        source={{ uri: item.image.asset.url }} // Asegúrate de que la URL de la imagen sea válida
        style={{ width: wp(38), height: hp(12) }}
        className="rounded-xl"
        resizeMode="cover"
      />

      {/* Texto - nombre y precio */}
      <View className="pl-4">
        <Text className="text-lg font-semibold ">
          {item.name || "Nombre no disponible"}
        </Text>

        <Text className="text-base mt-2">
          {item.price
            ? user && !user.isAnonymous && item.Descuento > 0
              ? `$${(item.price * (1 - item.Descuento)).toLocaleString("es-ES")}` // Precio con descuento
              : `$${item.price.toLocaleString("es-ES")}` // Precio sin descuento
            : "Precio no disponible"}
        </Text>

        {/* Contador de cantidad */}
        <View className="items-center justify-between mt-3 flex-row">
          {/* Botón para disminuir la cantidad */}
          <TouchableOpacity
            onPress={() => dispatch(removeFromCart(item._id))} // Disminuir cantidad
            disabled={item.quantity <= 0}
          >
            <AntDesign name="minuscircle" size={hp(2.7)} color={"grey"} />
          </TouchableOpacity>

          {/* Mostrar la cantidad actual */}
          <Text className="text-lg ">{item.quantity}</Text>

          {/* Botón para aumentar la cantidad */}
          <TouchableOpacity
            onPress={() => dispatch(addToCart(item))} // Aumentar cantidad
          >
            <AntDesign name="pluscircle" size={hp(2.7)} color={"#E8A500"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón para vaciar el carrito 
            <View className="pl-4">
                <Button
                    title="Vaciar Carrito"
                    onPress={clearCart} // Vaciar el carrito cuando se presione este botón
                    color="#E8A500"
                />
            </View>*/}
    </View>
  );
};

export default CardCarrito;
