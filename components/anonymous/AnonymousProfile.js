import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

const AnonymousProfile = ({ handleLogout }) => {
  const navigation = useNavigation();

  return (
    <View className=" justify-center items-center">
      <Image
        style={{ width: 200, height: 200, marginTop: hp(10) }}
        source={require("../../assets/Imagenes-new/padlock.png")}
        className="w-72 h-72"
        resizeMode="contain"
      />
      <Text style={{ paddingTop: hp(5) }} className="text-2xl font-bold text-zinc-700">
        ¡Ups! debes registrarte para poder ver tu perfil...
      </Text>

      {/* Botón de registro */}
      <TouchableOpacity
        style={{ margin: hp(3) }}
        className="bg-amber-500 px-6 py-3 w-72 rounded-full"
        onPress={() => navigation.navigate("SignUpScreen")}
      >
        <Text className="text-lg text-center">Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-amber-500 px-6 py-3 w-72 rounded-full"
        onPress={handleLogout}
      >
        <Text className="text-lg text-center">Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AnonymousProfile;
