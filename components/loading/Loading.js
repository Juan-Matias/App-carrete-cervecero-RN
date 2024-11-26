import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';


export default function Loading({ size}) {
    return (
      <View style={{ height: size, aspectRatio: 2 }}>
        <LottieView 
          style={{ flex: 1 }} 
          source={require('../../assets/Imagenes-new/Loading/Loading_animation.json')} 
          autoPlay 
          loop 
        />
      </View>
    );
  }
  