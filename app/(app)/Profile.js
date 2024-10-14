import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Avatar } from "react-native-paper";

import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/authContext"; // Asumiendo que manejas tu contexto de autenticación
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [profileUrl, setProfileUrl] = useState(
    "https://via.placeholder.com/150"
  ); // Imagen por defecto
  const [isEditingName, setIsEditingName] = useState(false); // Nuevo estado para manejar la edición del nombre
  const navigation = useNavigation();
  const {
    user,
    logout,
    updateUserName,
    updateUserPassword,
    refreshUserData,
    reauthenticateUser,
    updateUserPhone,
  } = useAuth(); // Obtenemos el usuario del contexto

  // Efecto para establecer el nombre y email del usuario autenticado
  useEffect(() => {
    if (user) {
      setUsername(user.username || "Prueba"); // Nombre del usuario o "Usuario Invitado"
      setEmail(user.email || "Prueba@example.com"); // Email del usuario o uno por defecto
      setTelefono(user.telefono || "Agregar Telefono");

    }
  }, [user]);

  // Función para elegir imagen
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Lo siento, necesitamos permiso para acceder a tu galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileUrl(result.uri); // Establecer nueva imagen de perfil
    }
  };

  const handleUsernameChange = async () => {
    const result = await updateUserName(username); // Función que actualiza el nombre
    if (result.success) {
      await refreshUserData(); // Llamada a la función para recargar los datos del usuario
      alert("Nombre de usuario actualizado");
      setIsEditingName(false); // Oculta el campo de texto después de guardar
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // Función para cambiar la contraseña
  const handlePasswordChange = async () => {
    // Primero, re-autenticar al usuario
    const reauthResult = await reauthenticateUser(email, currentPassword);
    if (reauthResult.success) {
      // Si la re-autenticación es exitosa, proceder con el cambio de contraseña
      const result = await updateUserPassword(newPassword);
      if (result.success) {
        alert("Contraseña actualizada");
      } else {
        alert(`Error: ${result.message}`);
      }
    } else {
      alert(`Error al re-autenticar: ${reauthResult.message}`);
    }
  };


  const handlePhoneChange = async () => {
    const result = await updateUserPhone(telefono);
    if (result.success) {
      await refreshUserData();
      setShowAlert(true);
      setAlertMessage("Teléfono actualizado con éxito.");
    } else {
      setAlertMessage(result.message || "Error al actualizar el teléfono.");
      setShowAlert(true);
    }
  };


  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
    }
  };

  return (
    <View className="flex-1 justify-start items-center pt-4 bg-white">
      {/* Imagen de avatar y detalles */}

      {/* Botones y campos de entrada */}
      {user && !user.isAnonymous && (
        <>
          <View className="flex-row justify-start items-center mb-4 bg-gray-100 rounded-lg shadow-md p-4">
            <View style={{ position: 'relative' }}>


              {/* Sección de Avatar */}
              <Avatar.Image
                size={70}
                source={{ uri: profileUrl }}
                style={{ marginRight: 10 }}
              />

              {/* Sección de botón cambiar imagen */}
              <TouchableOpacity
                onPress={handleImagePicker}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  borderRadius: 15,
                  padding: 5,
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={hp(2.7)}
                  color="gray"
                />
              </TouchableOpacity>
            </View>



            {/* Sección de nombre y email del usuario */}
            <View className="pl-2 w-52">
              <View className="flex-row justify-between">
                {isEditingName ? (
                  // Campo de texto para editar el nombre
                  <TextInput
                    className="border-b border-gray-300 flex-1"
                    placeholder="Nuevo nombre de usuario"
                    value={username}
                    onChangeText={setUsername}
                    autoFocus
                  />
                ) : (
                  // Texto que muestra el nombre
                  <Text className="text-lg font-bold ">{username}</Text>
                )}

                {/* Botón para editar el nombre */}
                <TouchableOpacity onPress={() => setIsEditingName(!isEditingName)}>
                  <MaterialCommunityIcons
                    name={isEditingName ? "check" : "pencil-outline"}
                    size={hp(2.7)}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>


              <Text className="text-base font-semibold text-zinc-600">
                {email}
              </Text>

              {/* Seccion - Agregar Telefono*/}
              <View className="pt-2 flex-row justify-between  w-52">
                <TextInput
                  className="  rounded-lg text-left"
                  placeholder="Actualizar número de teléfono"
                  value={telefono}
                  onChangeText={setTelefono}
                  keyboardType="numeric"
                // Muestra el botón cuando el campo está en foco
                //onBlur={() => setIsEditingPhone(false)} // Oculta el botón cuando el campo pierde el foco
                />

                <TouchableOpacity onPress={() => setIsEditingPhone(!isEditingPhone)}>
                  <MaterialCommunityIcons
                    name={isEditingPhone ? "check" : "pencil-outline"}
                    size={hp(2.7)}
                    color="gray"
                  />
                </TouchableOpacity>

              </View>
            </View>

          </View>

          {/* Mostrar botón de guardar solo si se está editando el nombre */}
          {isEditingName && (
            <TouchableOpacity
              onPress={handleUsernameChange}
              className="bg-blue-500 px-6 py-3 rounded-full mb-4"
            >
              <Text className="text-white text-center">Guardar Nombre</Text>
            </TouchableOpacity>
          )}



          {/* Seccion Btn cambiar contraseña */}
          <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-4 w-80 rounded-lg shadow-md mb-4">
            <Ionicons name="lock-closed-outline" size={24} color="black" />
            <Text className="ml-4 text-base font-semibold">Cambiar contraseña</Text>
          </TouchableOpacity>

          {/* Campos para actualizar contraseña */}
          <TextInput
            className="w-80 p-3 border border-gray-300 rounded-lg text-center mb-4"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <TextInput
            className="w-80 p-3 border border-gray-300 rounded-lg text-center mb-4"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={handlePasswordChange}
            className="bg-blue-500 px-6 py-3 rounded-full mb-4"
          >
            <Text className="text-white text-center">Cambiar Contraseña</Text>
          </TouchableOpacity>

          {/* Botón de cerrar sesión */}
          <TouchableOpacity
            style={{ margin: hp(10) }}
            className="bg-red-600 px-6 py-3 w-80 rounded-xl"
            onPress={handleLogout}
          >
            <Text className="text-white text-lg text-center">Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      )}

      {user.isAnonymous && (
        <>
          <Image
            style={{ width: 200, height: 200, marginTop: hp(10) }}
            source={require("../../assets/Imagenes-new/padlock.png")}
            className="w-72 h-72"
            resizeMode="contain"
          />
          <Text
            style={{ paddingTop: hp(5) }}
            className="text-2xl font-bold text-zinc-700 "
          >
            ¡Ups! debes registrarte para poder ver tu pefil...
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
        </>
      )}
    </View>
  );
};

export default ProfileScreen;
