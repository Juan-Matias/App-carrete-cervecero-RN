import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../conection/FireBaseConection/firebaseConfig.js";

// Importaciones de componentes
import CustomKeyboardView from "../components/keyboard/CustomKeyboardView.js";
import Alert from "../components/alerts/Alert.js";

// Importa Ionicons para el ícono de cierre
import { AntDesign, Octicons } from "@expo/vector-icons";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  // Ajusta el tamaño de la imagen
  const imageWidth = hp(28);

  {/* Sección Lógica del botón */ }
  const handleResetPassword = async () => {
    if (!email) {
      setAlertMessage("Por favor, ingrese\n su correo electrónico.");
      setShowAlert(true);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setAlertMessage("Se ha enviado un enlace de\n recuperación a su correo electrónico.");
      setShowAlert(true);
      setTimeout(() => router.push("/SignInScreen"), 3000); // Redirige después de mostrar el alert
    } catch (error) {
      setAlertMessage(error.message || "Hubo un problema al intentar\n enviar el enlace de recuperación.");
      setShowAlert(true);
    }
  };

  return (
    <CustomKeyboardView>
      {/* Sección del ícono de cierre */}
      <TouchableOpacity
        onPress={() => router.push("/SignInScreen")}
        style={{ position: "absolute", top: hp(9), left: hp(3) }}
      >
        <AntDesign name="leftcircle" size={36} color='grey' />
      </TouchableOpacity>

      {/* Sección imagen */}
      <View style={{ paddingTop: hp(19) }} className="flex-1 px-4">
        <View className="items-center">
          <Image
            style={{ height: imageWidth }}
            resizeMode="contain"
            source={require("../assets/Imagenes-new/Resetpassword.png")}
          />
        </View>

        {/* Sección Texto */}
        <Text style={{ paddingTop: hp(0.5), fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
          Recuperar Contraseña
        </Text>

        {/* Sección TextInput con ícono */}
        <View style={{ paddingTop: hp(3)}}>
        <View className="relative w-full px-1 mt-6">
          <TextInput
            style={{ fontSize: hp(2) }}
            className="bg-gray-100 p-3 pl-12 rounded-xl font-semibold"
            placeholder="Ingrese su correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="gray"
          />
          <View className="absolute top-4 left-5">
            <Octicons name="mail" size={hp(2.7)}  />
          </View>
        </View>
        </View>

        {/* Sección botón Enviar */}
        <View style={{ paddingTop: hp(2.5) }} className="items-center">
          <TouchableOpacity
            onPress={handleResetPassword}
            className="h-12 w-72 bg-yellow-500 rounded-xl justify-center items-center"
          >
            <Text className="text-white text-2xl font-bold tracking-wider">
              Enviar Enlace
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sección Alert */}
        <View style={{ paddingTop: hp(10) }}>
          {showAlert && <Alert message={alertMessage} onDismiss={() => setShowAlert(false)} />}
        </View>
      </View>
    </CustomKeyboardView>
  );
};

export default PasswordRecovery;
