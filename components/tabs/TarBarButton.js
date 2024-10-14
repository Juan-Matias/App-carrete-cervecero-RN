import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';

import { icons } from '../../assets/icons.js'; 
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function TabBarButton(props) {
  const { isFocused, label, routeName, color } = props;

  // Valor compartido para la animación
  const scale = useSharedValue(0);

  // Efecto para manejar la animación al enfocarse
  useEffect(() => {
    scale.value = withSpring(
      isFocused ? 1 : 0,
      { duration: 350 }
    );
  }, [isFocused]);

  // Estilo animado para el ícono
  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scale.value,
      [0, 1],
      [1, 1.4]
    );

    const top = interpolate(
      scale.value,
      [0, 1],
      [0, 8]
    );

    return {
      transform: [{ scale: scaleValue }], // Escalar el ícono
      top // Desplazar verticalmente el ícono
    };
  });

  // Estilo animado para el texto
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scale.value,
      [0, 1],
      [1, 0]
    );

    return {
      opacity // Cambiar la opacidad del texto al enfocarse
    };
  });

  return (
    // Botón de tab con estilos aplicados usando nativewind
    <Pressable {...props} className="flex-1 justify-center items-center gap-1">
      {/* Ícono animado */}
      <Animated.View style={animatedIconStyle}>
        {icons[routeName]({
          color, // Color dinámico dependiendo de si está enfocado
        })}
      </Animated.View>

      {/* Texto animado */}
      <Animated.Text
        className={`text-xs mt-1`}
        style={[
          { color }, // Aplicar el color dinámico
          animatedTextStyle // Aplicar animación
        ]}
      >
        {label}
      </Animated.Text>
    </Pressable>
  );
}