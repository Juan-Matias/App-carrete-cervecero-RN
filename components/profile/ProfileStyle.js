// ProfileStyle.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Avatar } from "react-native-paper";
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/authContext";

const ProfileStyle = ({ user, profileUrl, setProfileUrl, navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  
  const {
    logout,
    updateUserName,
    updateUserPassword,
    refreshUserData,
    reauthenticateUser,
    updateUserPhone,
  } = useAuth();

  useEffect(() => {
    if (user) {
      setUsername(user.username || "Prueba");
      setEmail(user.email || "Prueba@example.com");
      setTelefono(user.telefono || "Agregar Telefono");
    }
  }, [user]);

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
      setProfileUrl(result.uri);
    }
  };

  const handleUsernameChange = async () => {
    const result = await updateUserName(username);
    if (result.success) {
      await refreshUserData();
      alert("Nombre de usuario actualizado");
      setIsEditingName(false);
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  const handlePasswordChange = async () => {
    const reauthResult = await reauthenticateUser(email, currentPassword);
    if (reauthResult.success) {
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
      alert("Teléfono actualizado con éxito.");
    } else {
      alert(result.message || "Error al actualizar el teléfono.");
    }
  };

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
      <View className="flex-row justify-start items-center mb-4 bg-gray-100 rounded-lg shadow-md p-4">
        <View style={{ position: 'relative' }}>
          <Avatar.Image
            size={70}
            source={{ uri: profileUrl }}
            style={{ marginRight: 10 }}
          />
          <TouchableOpacity onPress={handleImagePicker} style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', borderRadius: 15, padding: 5 }}>
            <MaterialIcons name="photo-camera" size={hp(2.7)} color="gray" />
          </TouchableOpacity>
        </View>

        <View className="pl-2 w-52">
          <View className="flex-row justify-between">
            {isEditingName ? (
              <TextInput
                className="border-b border-gray-300 flex-1"
                placeholder="Nuevo nombre de usuario"
                value={username}
                onChangeText={setUsername}
                autoFocus
              />
            ) : (
              <Text className="text-lg font-bold ">{username}</Text>
            )}

            <TouchableOpacity onPress={() => setIsEditingName(!isEditingName)}>
              <MaterialCommunityIcons name={isEditingName ? "check" : "pencil-outline"} size={hp(2.7)} color="gray" />
            </TouchableOpacity>
          </View>
          <Text className="text-base font-semibold text-zinc-600">{email}</Text>

          <View className="pt-2 flex-row justify-between  w-52">
            <TextInput
              className="rounded-lg text-left"
              placeholder="Actualizar número de teléfono"
              value={telefono}
              onChangeText={setTelefono}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => setIsEditingPhone(!isEditingPhone)}>
              <MaterialCommunityIcons name={isEditingPhone ? "check" : "pencil-outline"} size={hp(2.7)} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {isEditingName && (
        <TouchableOpacity onPress={handleUsernameChange} className="bg-blue-500 px-6 py-3 rounded-full mb-4">
          <Text className="text-white text-center">Guardar Nombre</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity className="flex-row items-center bg-gray-100 px-4 py-4 w-80 rounded-lg shadow-md mb-4">
        <Ionicons name="lock-closed-outline" size={24} color="black" />
        <Text className="ml-4 text-base font-semibold">Cambiar contraseña</Text>
      </TouchableOpacity>

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
      <TouchableOpacity onPress={handlePasswordChange} className="bg-blue-500 px-6 py-3 rounded-full mb-4">
        <Text className="text-white text-center">Cambiar Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ margin: hp(10) }} className="bg-red-600 px-6 py-3 w-80 rounded-xl" onPress={handleLogout}>
        <Text className="text-white text-lg text-center">Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileStyle;
