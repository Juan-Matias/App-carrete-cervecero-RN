import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Avatar } from "react-native-paper";
import {MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/authContext";
import CustomKeyboardView from "../keyboard/CustomKeyboardView";

const ProfileStyle = ({ user, profileUrl, setProfileUrl, navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const [showNameModal, setShowNameModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

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
      setShowNameModal(false);
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
        setCurrentPassword("");
        setNewPassword("");
        setShowPasswordModal(false);
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
      setShowPhoneModal(false);
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
    <CustomKeyboardView>
      <>
        <View className="justify-start items-center " style={{ paddingTop: hp(4) }}>
          <View style={{ position: "relative", marginBottom: 10 }}>
            <Avatar.Image
              size={150}
              source={{ uri: profileUrl }}
              style={{ marginRight: 10 }}
            />
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#ffffff",
                borderRadius: 20,
                padding: 5,
              }}
            >
              <MaterialIcons name="photo-camera" size={hp(4)} color="gray" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ paddingTop: hp(4) }} className="p-5">
          {/* Nombre */}
          <TouchableOpacity onPress={() => setShowNameModal(true)}>
            <View className="flex-row mb-4 bg-white rounded-lg shadow-md p-4 items-center justify-between">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="account" size={24} color="gray" />
                <Text className="text-lg font-bold ml-2">{username}</Text>
              </View>
              <MaterialCommunityIcons name="pencil-outline" size={24} color="gray" />
            </View>
          </TouchableOpacity>

          {/* Correo (solo visualización) */}
          <View className="flex-row mb-4 bg-white rounded-lg shadow-md p-4 items-center">
            <MaterialCommunityIcons name="email-outline" size={24} color="gray" />
            <Text className="text-lg font-bold ml-2">{email}</Text>
          </View>

          {/* Teléfono */}
          <TouchableOpacity onPress={() => setShowPhoneModal(true)}>
            <View className="flex-row mb-4 bg-white rounded-lg shadow-md p-4 items-center justify-between">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="phone" size={hp(2.7)} color="gray" />
                <Text className="text-lg font-bold ml-2">{telefono}</Text>
              </View>
              <MaterialCommunityIcons name="pencil-outline" size={hp(2.7)} color="gray" />
            </View>
          </TouchableOpacity>

          {/* Contraseña */}
          <TouchableOpacity onPress={() => setShowPasswordModal(true)}>
            <View className="flex-row mb-4 bg-white rounded-lg shadow-md p-4 items-center justify-between">
              <Text className="text-lg font-bold">Cambiar Contraseña</Text>
              <MaterialCommunityIcons name="pencil-outline" size={hp(2.7)} color="gray" />
            </View>
          </TouchableOpacity>

          {/* Botón de Cerrar Sesión */}
          <TouchableOpacity onPress={handleLogout}>
            <View className="bg-red-500 rounded-lg p-3 items-center mt-6" >
              <Text className="text-white text-lg font-bold">Cerrar Sesión</Text>
            </View>
          </TouchableOpacity>
        </View>


        {/* Modal de cambio de nombre */}
        <Modal visible={showNameModal} transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View className="bg-white rounded-lg p-6 w-80 relative">
              {/* Icono para cerrar el modal */}
              <TouchableOpacity
                onPress={() => setShowNameModal(false)}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="close" size={24} color="gray" />
              </TouchableOpacity>

              <Text className="text-lg font-bold mb-4">Editar Nombre</Text>
              <TextInput
                className="border-b border-gray-300 mb-4"
                placeholder="Nuevo nombre de usuario"
                value={username}
                onChangeText={setUsername}
                autoFocus
              />
              <TouchableOpacity onPress={handleUsernameChange} className="bg-blue-500 px-4 py-2 rounded-full">
                <Text className="text-white text-center">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>


      {/* Modal de cambio de Telefono */}
        <Modal visible={showPhoneModal} transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View className="bg-white rounded-lg p-6 w-80 relative">
              {/* Icono para cerrar el modal */}
              <TouchableOpacity
                onPress={() => setShowPhoneModal(false)}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="close" size={24} color="gray" />
              </TouchableOpacity>

              <Text className="text-lg font-bold mb-4">Editar Teléfono</Text>
              <TextInput
                className="border-b border-gray-300 mb-4"
                placeholder="Nuevo número de teléfono"
                value={telefono}
                onChangeText={setTelefono}
                autoFocus
              />
              <TouchableOpacity onPress={handlePhoneChange} className="bg-blue-500 px-4 py-2 rounded-full">
                <Text className="text-white text-center">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      {/* Modal de cambio de Contraseña */}
        <Modal visible={showPasswordModal} transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View className="bg-white rounded-lg p-6 w-80 relative">
              {/* Icono para cerrar el modal */}
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="close" size={24} color="gray" />
              </TouchableOpacity>

              <Text className="text-lg font-bold mb-4">Cambiar Contraseña</Text>
              <TextInput
                className="border-b border-gray-300 mb-4"
                placeholder="Contraseña actual"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                autoFocus
              />
              <TextInput
                className="border-b border-gray-300 mb-4"
                placeholder="Nueva contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TouchableOpacity onPress={handlePasswordChange} className="bg-blue-500 px-4 py-2 rounded-full">
                <Text className="text-white text-center">Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </>
    </CustomKeyboardView>
  );
};

export default ProfileStyle;
