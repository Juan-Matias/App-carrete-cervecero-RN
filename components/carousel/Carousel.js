import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { styled } from 'nativewind';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window'); // Obtén el ancho de la pantalla

// Aplicar estilos de nativewind a los componentes
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

const Carrusel = ({ items }) => {
  
  // Establece tamaño para el carrusel
  const carouselWidth = wp(100); 
  const carouselHeight = hp(45); 
  return (
    <Carousel
      width={carouselWidth} // Ancho del carrusel
      height={carouselHeight} // Altura del carrusel
      data={items} // Recibe los items desde el componente Home
      renderItem={({ item }) => (

        <StyledView className="items-center justify-center p-0.5 ">
          <StyledImage
            source={{ uri: item.image }} // Muestra la imagen desde la URL
            style={{ 
              width: '100%', // Ancho completo del contenedor del carrusel
              height: '90%', // Altura de la imagen ajustada al 90% de la altura del carrusel
              borderColor: 'black', // Color del borde
              
              borderWidth: 2, // Grosor del borde
              borderRadius: 10, // Radio del borde (border-radius) de la imagen
            
              marginTop: 15
            }} 
            resizeMode="cover"
          />

          <View className="justify-center mt-4">
            <StyledText className="text-3xl font-extrabold text-black text-center tracking-widest uppercase italic">
              {item.title}
            </StyledText>
            <StyledText className="text-base font-semibold text-gray-600 text-center tracking-widest uppercase italic">
              {item.text}
            </StyledText>
          </View>
        </StyledView>
      )}
      mode="parallax" // Puedes ajustar esto para cambiar el modo del carrusel
      pagingEnabled
    />
  );
};

export default Carrusel;
