import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { Button } from "react-native-paper"; // Para mostrar cada pedido en un Card y agregar un botón

const AnonymousProfile = ({ handleLogout }) => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 items-center ">
      {/* Seccion - Imagen */}
      <View style={{ paddingTop: hp(5) }}>
        <Image
          style={{ width: 150, height: 200, marginTop: hp(8) }}
          source={require("../../assets/Imagenes-new/padlock.png")}
          className="w-72 h-72"
          resizeMode="contain"
        />
      </View>

      {/* Botón de registro */}
      <View className="items-center " style={{ paddingTop: hp(6) }}>
        {/* Seccion - Texto */}
        <Text className="text-xl font-semibold text-gray-700 text-center">
          ¡Ups! debes registrarte para poder ver tu perfil...
        </Text>

        <View className="pt-2" style={{ paddingTop: hp(4) }}>
          <Button
            mode="contained"
            className=" bg-amber-500 rounded-lg justify-center w-80"
            labelStyle={{ color: "white" }}
            onPress={() => navigation.navigate("SignUpScreen")}
          >
            <Text className="text-base"> Registrarse</Text>
          </Button>
        </View>

        {/* Botón de Registrarse */}
        <View className="pt-4 ">
          <Button
            mode="contained"
            className=" bg-red-500 rounded-lg justify-center w-80"
            labelStyle={{ color: "white" }}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Text className="text-base">Cerrar Sesión </Text>
          </Button>
        </View>
      </View>
    </View>
  );
};

export default AnonymousProfile;
