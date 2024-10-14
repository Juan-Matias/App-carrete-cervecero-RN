import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { urlFor } from '../../sanity.js';

const { width } = Dimensions.get('window');

const Categories = ({ categories, activeCategory, setActiveCategory }) => {

  // Ajusta estos valores según tus necesidades
  const imageWidth = wp(14); // Porcentaje del ancho de la pantalla
  const imageHeight = hp(6); // Porcentaje de la altura de la pantalla

  const primatyColor = '#FFDF8A'; // Color principal
  const secondColor = '#E2E2E2'; // Color Secundario

  return (
    <View className="px-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-zinc-700">
          Categorías
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      >
        {(categories || []).map((category, index) => {
          const isActive = category._id === activeCategory;

          // Animación para el botón
          const animatedButtonStyle = useAnimatedStyle(() => {
            return {
              backgroundColor: withTiming(isActive ? primatyColor : secondColor, { duration: 100 }),
            };
          });

          // Animación para el tamaño de la imagen
          const animatedImageStyle = useAnimatedStyle(() => {
            return {
              transform: [{ scale: withTiming(isActive ? 1.12 : 1.15, { duration: 200 }) }],
              opacity: withTiming(isActive ? 1 : 0.6, { duration: 200 }), // Ajusta la opacidad de la imagen
            };
          });

          const textClass = isActive ? 'font-semibold text-gray-900' : 'text-zinc-700';

          return (
            <View key={index} className="items-center mr-5 ">
              <TouchableOpacity
                onPress={() => setActiveCategory(category._id)}
                activeOpacity={0.7}
              >
                {/* Botón animado */}
                <Animated.View
                  className={`p-2 rounded-2xl shadow `}
                  style={animatedButtonStyle}
                >
                  {/* Imagen animada */}
                  <Animated.Image
                    style={[
                      {
                        width: imageWidth,
                        height: imageHeight,
                        borderRadius: 10,
                        resizeMode: 'cover',
                      },
                      animatedImageStyle, // Aplicar animación
                    ]}
                    source={{ uri: urlFor(category.image).url() }}
                  />
                </Animated.View>
              </TouchableOpacity>
              <Text className={`text-sm mt-2  ${textClass}`}>
                {category.name}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Categories;
