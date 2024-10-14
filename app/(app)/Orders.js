import { View, Image, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native'; // Importa el hook correctamente

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Tamaño de la imagen
const imageWidth = wp(54);
const imageHeight = hp(17);

export default function Carrito() {
  const navigation = useNavigation(); // Usa el hook dentro del componente

  const handleSignIn = () => {
    navigation.navigate('Products'); // Navega a la pantalla de productos
  };

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      {/* Imagen con estilo ajustado */}
      <Image
        source={require('../../assets/imagen-mascota/Cerveza-producto.png')}
        className="w-72 h-72"
        resizeMode="contain"
      />

      <Text className="mt-4 text-lg font-semibold text-gray-700 text-center">
        ¡Mmmmmmm! Parece que aún no añades ningún pedido a tu carrito.
      </Text>

      {/* Botón de agregar */}
      <Button
        mode="contained"
        onPress={handleSignIn} // Asegúrate de que onPress esté correctamente definido
        className="mt-6 bg-amber-500 rounded-lg"
        labelStyle={{ color: 'white' }}
      >
        Añadir barriles
      </Button>
    </View>
  );
}
