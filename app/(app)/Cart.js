// Carrito.js
import { View, Image, Text, FlatList } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import CardCarrito from '../../components/cart/CardCarrito.js'; // Importa el nuevo componente
import Facturacion from '../../components/factura/Facturacion.js';

const Carrito = () => {
  const navigation = useNavigation();
  const cart = useSelector(state => state.cart.items);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSignIn = () => {
    navigation.navigate('Products');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      {cart.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Image
            source={require('../../assets/imagen-mascota/Cerveza-carrito.png')}
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
            labelStyle={{ color: 'white' }}
          >
            Añadir barriles
          </Button>
        </View>
      ) : (
        <View className="flex-1">
          {/* Lista de productos en el carrito */}
          <FlatList
            data={cart} // Los datos a mostrar son los productos en el carrito
            renderItem={({ item }) => <CardCarrito item={item} />} // Usa el nuevo componente
            keyExtractor={(item) => item._id ? item._id.toString() : `${item.id}`} // Genera una clave única para cada ítem
          />
          <Button
            mode="contained"
            className="mt-4 bg-amber-500 rounded-lg"
            labelStyle={{ color: 'white' }}
            onPress={openModal}
          >
            Reservar
          </Button>

          <Facturacion
            isVisible={isModalVisible}
            onClose={closeModal}
            cart={cart}
            total={total}
          />
        </View>
      )}
    </View>
  );
};

export default Carrito;
