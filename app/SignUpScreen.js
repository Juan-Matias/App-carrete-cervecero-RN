import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Animated } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Importaciones de componentes
import CustomKeyboardView from '../components/keyboard/CustomKeyboardView.js';
import Loading from '../components/loading/Loading.js';
import Alert from '../components/alerts/Alert.js';

// Importaciones de hook
import useSignUpLogic from '../hooks/login/useSignUpLogic'; // Importa el hook de lógica

export default function SignUp() {
  // Desestructuración del hook de lógica de registro
  const {
    refs,                // Referencias de los campos del formulario
    errors,              // Estado de los errores
    setErrors,           // Función para actualizar los errores
    loading,             // Estado de carga
    alertMessage,        // Mensaje de alerta
    setAlertMessage,     // Función para actualizar el mensaje de alerta
    handleRegister,      // Función de registro
  } = useSignUpLogic();

  const router = useRouter(); // Router para la navegación
  const opacity = new Animated.Value(1); // Estado para la animación de la alerta

  // Estado para la visibilidad de las contraseñas
  const [passwordShown, setPasswordShown] = useState({
    password: false,
    confirmPassword: false,
  });

  // Función para alternar la visibilidad de las contraseñas
  const togglePasswordVisibility = (field) => {
    setPasswordShown((prev) => ({
      ...prev,
      [field]: !prev[field], // Cambia la visibilidad del campo específico
    }));
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />

      {/* Contenedor principal */}
      <View style={{ paddingTop: hp(15), paddingHorizontal: wp(5) }} className="flex-1">
        <View className="gap-y-8">
          {/* Título y subtítulo */}
          <View>
            <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
              Registrarse
            </Text>
            <Text style={{ fontSize: hp(2) }} className="font-semibold tracking-wider text-center text-neutral-600">
              Crea una cuenta nueva
            </Text>
          </View>

          {/* Sección de inputs */}
          <View className="gap-y-4">
            {/* Mapeo de los campos de input */}
            {Object.keys(refs).map((key, index) => (
              <View key={index}>
                <View
                  style={{ height: hp(7) }}
                  className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl"
                >
                  {/* Ícono para cada input dependiendo del campo */}
                  <Feather
                    name={
                      key === "username" ? "user" :
                      key === "telefono" ? "phone" :
                      key === "email" ? "mail" : "lock"
                    }
                    size={hp(2.7)}
                  />
                  
                  {/* Input correspondiente */}
                  <TextInput
                    ref={refs[key]} // Referencia del input
                    onChangeText={value => {
                      refs[key].current.value = value; // Almacenar el valor ingresado
                      if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" })); // Limpiar errores
                     
                    }}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-800"
                    
                    placeholder={
                      key === "username" ? "Nombre Completo" :
                      key === "telefono" ? "Teléfono" :
                      key === "email" ? "Correo" :
                      
                      key === "password" ? "Contraseña" : "Confirmar Contraseña"
                    }
                    keyboardType="email-address"
                    placeholderTextColor="gray"
                    secureTextEntry={key.includes("password") && !passwordShown[key]} // Alternar visibilidad de contraseñas
                  />
                  
                  {/* Botón para mostrar/ocultar la contraseña */}
                  {key.includes("password") && (
                    <TouchableOpacity onPress={() => togglePasswordVisibility(key)}>
                      <Octicons
                        name={passwordShown[key] ? "eye" : "eye-closed"} // Cambia el ícono
                        size={hp(2.7)}
                        color="gray"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* Botón de registro o indicador de carga */}
            <View style={{ paddingTop: hp(1) }}>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleRegister} // Función de registro
                  style={{ height: hp(6.5), backgroundColor: '#E8A500' }} // Color de fondo del botón
                  className="rounded-xl justify-center items-center"
                >
                  <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                    Registrarse
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Mensaje de error general */}
            {errors.general && (
              <Text style={{ fontSize: hp(1.8), color: 'red', textAlign: 'center' }}>
                {errors.general}
              </Text>
            )}

            {/* Enlace a Iniciar Sesión */}
            <View className="flex-row justify-center gap-x-2">
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                ¿Ya tienes una cuenta?
              </Text>
              <Pressable onPress={() => router.push('SignInScreen')}>
                <Text style={{ fontSize: hp(2) }} className="font-bold text-amber-600">
                  Iniciar sesión
                </Text>
              </Pressable>
            </View>

            {/* Alerta de éxito o error */}
            <View style={{ paddingTop: hp(3) }}>
              {alertMessage ? (
                <Alert
                  style={{ opacity }} // Animación de la alerta
                  message={alertMessage} // Mensaje de la alerta
                  onDismiss={() => setAlertMessage('')} // Función para cerrar la alerta
                />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}