import React, { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importa el ícono que deseas usar
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Alert({ message, onDismiss }) {
  const opacity = useRef(new Animated.Value(1)).current; // Usa useRef para mantener el valor

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true, // Habilita el uso del driver nativo
      }).start(() => onDismiss()); // Llama a la función onDismiss cuando la animación termine
    }, 3000); // Mantén la alerta visible durante 3 segundos

    return () => clearTimeout(timer); // Limpia el temporizador cuando el componente se desmonte
  }, [onDismiss]);

  return (
    <Animated.View 
      style={{ opacity }} // Aplica la animación de opacidad
      className="absolute bottom-10 left-0 right-0 items-center z-50" // Ajusta la posición
    >
      <View className="bg-red-500 px-10 py-2 rounded-xl flex-row items-center">
        <Ionicons name="beer-outline" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
