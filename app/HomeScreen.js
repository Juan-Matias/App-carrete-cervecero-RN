import React, { useState } from "react";
import { View, Text, TouchableOpacity, Linking, Image } from "react-native";
import { useRouter } from "expo-router";

import { MaterialIcons } from "@expo/vector-icons";
import {heightPercentageToDP as hp,widthPercentageToDP as wp,} from "react-native-responsive-screen";


import { useAuth } from "../context/authContext";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const [phoneNumber] = useState("(973) 210-343");
  const { guestLogin } = useAuth(); 
  const navigation = useNavigation();
  const router = useRouter();

  const handlePressCallIcon = () => {
    console.log(`Llamando al número: ${phoneNumber}`);
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSignIn = () => {
    navigation.navigate("SignInScreen");
  };

  const handleSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  const handleGuestLogin = async () => {
    const result = await guestLogin();
    if (result.success) {
      console.log("Ingresaste como invitado");
      // Navegar a la pantalla principal de la app
      router.push("/Home"); 
    } else {
      console.log("Error al ingresar como invitado: ", result.message);
    }
  };

  return (
    <View
      style={{ paddingTop: hp(8) }}
      className="flex-1 "
    >
      {/* Logo y Icono de Llamada */}
      <View className="flex-row justify-between items-center p-4">
        {/* Logo */}
        <Image
          style={{ height: hp(9), width: hp(20) }}
          source={require("../assets/Imagenes-new/B1.png")}
          resizeMode="contain"
        />
        {/* Icono de Llamada */}
        <View>
          <TouchableOpacity
            onPress={handlePressCallIcon}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: 50,
              padding: 8,
            }}
          >
            <MaterialIcons name="call" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Línea debajo del logo e icono */}
      <View
        style={{
          borderBottomColor: "lightgray",
          borderBottomWidth: 1,
          marginHorizontal: 16,
          marginBottom: 20,
          marginTop: 15,
        }}
      />

      {/* Título */}
      <View style={{ paddingTop: hp(4) }} className="items-center p-2">
        <Text className="font-light text-black text-6xl ">
          La 🎉{"\n"}Diversión en Cada Pinta & la Fiesta en Cada Barril 🍺
        </Text>
      </View>

      {/* Subtítulo */}
      <View style={{ paddingTop: hp(12) }} className="items-center">
        <Text className="text-sm text-gray-500 l-5">
          Regístrate para acceder a promociones únicas. De lo {"\n"}contrario, ingresa
          como invitado
        </Text>
      </View>

      {/* Botones de Inicio de Sesión y Registro */}
      <View className="flex-row justify-center space-x-4 pt-4">
        <TouchableOpacity
          className="bg-white border-2 border-yellow-500 rounded-2xl px-6 py-3"
          onPress={handleSignIn}
        >
          <Text className="font-medium text-lg">Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-yellow-500 rounded-2xl px-6 py-3"
          onPress={handleSignUp}
        >
          <Text className="text-white text-lg">Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Texto de Ingreso como Invitado */}
      <View className="items-center pt-4">
        <TouchableOpacity onPress={handleGuestLogin}>
          <Text className="text-black text-base font-semibold">Ingresar como invitado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}