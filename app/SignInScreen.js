import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Pressable, Animated } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { Octicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

//Importaciones de componentes
import CustomKeyboardView from '../components/keyboard/CustomKeyboardView.js';
import Loading from '../components/loading/Loading.js';
import Alert from '../components/alerts/Alert.js';

//Importaciones de hook
import useSignInLogic from '../hooks/login/useSignInLogic';


// [Seccion iniciar sesión]
const SignInUI = () => {
  // [Subsección: Enrutamiento]
  const router = useRouter();

  // [Subsección: Lógica de inicio de sesión]
  const {
    emailInputRef,
    passwordInputRef,
    emailRef,
    passwordRef,
    errors,
    setErrors,
    loading,
    alertMessage,
    handleLogin,
    setAlertMessage
  } = useSignInLogic();

    // [Subsección: Estado para la visibilidad de la contraseña]
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => setPasswordShown(!passwordShown);
  
    // [Subsección: Animación de opacidad]
    const opacity = new Animated.Value(1);
  
    // [Seccion diseño]
    return (
      <CustomKeyboardView>
        {/* Barra de estado */}
        <StatusBar style="dark" />
  
        {/* Contenedor principal */}
        <View 
          style={{ paddingTop: hp(7), paddingHorizontal: hp(4) }}
          className="flex-1"
        >
          {/* Imagen de SignIn */}
          <View className="items-center">
            <Image
              style={{ height: hp(25) }}
              resizeMode="contain"
              source={require("../assets/Imagenes-new/Login1.png")}
            />
          </View>
  
          {/* Sección de texto y campos de entrada */}
          <View className="gap-y-5">
            <Text
              style={{ fontSize: hp(4), paddingTop: hp(2) }}
              className="font-bold tracking-wider text-center text-neutral-800"
            >
              Iniciar sesión
            </Text>
  
            {/* Inputs de correo electrónico y contraseña */}
            <View style={{ paddingTop: hp(1) }} className="gap-y-4">
              {/* Campo de correo electrónico */}
              <View
                style={{ height: hp(7) }}
                className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl"
              >
                <Octicons name="mail" size={hp(2.7)} />
                <TextInput
                  ref={emailInputRef}
                  onChangeText={(value) => {
                    emailRef.current = value;
                    if (errors?.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Correo electrónico"
                  placeholderTextColor="gray"
                  keyboardType="email-address"
             
                />
              </View>
  
              {/* Campo de contraseña */}
              <View className="gap-y-1.5">
                <View
                  style={{ height: hp(7) }}
                  className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl"
                >
                  <Octicons name="lock" size={hp(2.7) }  />
                  <TextInput
                    ref={passwordInputRef}
                    onChangeText={(value) => {
                      passwordRef.current = value;
                      if (errors?.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-700"
                    placeholder="Contraseña"
                    secureTextEntry={!passwordShown}
                    placeholderTextColor="gray"
                  />
  
                  {/* Botón para mostrar/ocultar contraseña */}
                  <TouchableOpacity onPress={togglePasswordVisibility}>
                    <Octicons
                      name={passwordShown ? "eye" : "eye-closed"}
                      size={hp(2.7)}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
                <Pressable onPress={() => router.push("PasswordRecovery")}>
                  <Text
                    style={{ fontSize: hp(1.8) }}
                    className="font-semibold text-right text-neutral-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </Text>
                </Pressable>
              </View>
  
              {/* Botón de inicio de sesion */}
              <View>
                {loading ? (
                  <View className="flex-row justify-center">
                    <Loading size={hp(8)} />
                  </View>
                ) : (
                  <View style={{ paddingTop: hp(2) }}>
                    <TouchableOpacity
                      onPress={handleLogin}
                      style={{ height: hp(6.5), backgroundColor: "#E8A500" }}
                      className="rounded-xl justify-center items-center"
                    >
                      <Text
                        style={{ fontSize: hp(2.7) }}
                        className="text-white font-bold tracking-wider"
                      >
                        Iniciar sesión
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
  
              {/* Mensaje de error general */}
              {errors?.general && (
                <Text
                  style={{ fontSize: hp(1.8), color: "red", textAlign: "center" }}
                >
                  {errors.general}
                </Text>
              )}
  
              {/* Botón de inicio de sesión con Google */}
              <TouchableOpacity
                style={{ marginTop: hp(3) }}
                className="flex-row justify-center items-center bg-white border border-gray-300 rounded-xl py-3"
              >
                <Image
                  source={{
                    uri: "https://www.material-tailwind.com/logos/logo-google.png",
                  }}
                  style={{ width: hp(3), height: hp(3), marginRight: hp(1) }}
                />
                <Text style={{ fontSize: hp(2.3) }} className="text-gray-700">
                  Iniciar sesión con Google
                </Text>
              </TouchableOpacity>
  
              {/* Texto de registro */}
              <View
                className="flex-row justify-center gap-x-2"
                style={{ marginTop: hp(3) }}
              >
                <Text
                  style={{ fontSize: hp(1.8) }}
                  className="font-semibold text-neutral-500 "
                >
                  ¿No tienes una cuenta?
                </Text>
                <Pressable onPress={() => router.push("SignUpScreen")}>
                  <Text
                    style={{ fontSize: hp(2) }}
                    className="font-bold text-amber-600 "
                  >
                    Regístrate
                  </Text>
                </Pressable>
              </View>
  
              {/* Componente de alerta */}
              <View style={{ paddingTop: hp(1) }}>
                {alertMessage ? (
                  <Alert
                    style={{ opacity }}
                    message={alertMessage}
                    onDismiss={() => setAlertMessage("")}
                  />
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </CustomKeyboardView>
    );
  };
  

export default SignInUI;
