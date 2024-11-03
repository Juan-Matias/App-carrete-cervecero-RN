import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather, Octicons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CustomInputField = ({ 
  keyName, 
  refInput, 
  value, 
  onChangeText, 
  error, 
  setError, 
  passwordShown, 
  togglePasswordVisibility 
}) => {
  return (
    <View>
      <View
        style={{ height: hp(7) }}
        className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl"
      >
        {/* Ícono para cada input dependiendo del campo */}
        <Feather
          name={
            keyName === "username" ? "user" :
            keyName === "telefono" ? "phone" :
            keyName === "email" ? "mail" : "lock"
          }
          size={hp(2.7)}
        />

        {/* Input correspondiente */}
        <TextInput
  ref={refs[key]} // Referencia del input
  onChangeText={value => {
    if (refs[key] && refs[key].current) { // Verificar si refs[key] no es null
      refs[key].current.value = value; // Almacenar el valor ingresado
    }
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" })); // Limpiar errores si es necesario
  }}
  style={{ fontSize: hp(2) }}
  className="flex-1 font-semibold text-neutral-800"
  placeholder={
    key === "username" ? "Nombre Completo" :
    key === "telefono" ? "Teléfono" :
    key === "email" ? "Correo" :
    key === "password" ? "Contraseña" : "Confirmar Contraseña"
  }
  placeholderTextColor="gray"
  secureTextEntry={key.includes("password") && !passwordShown[key]} // Alternar visibilidad de contraseñas
/>

        {/* Botón para mostrar/ocultar la contraseña */}
        {keyName.includes("password") && (
          <TouchableOpacity onPress={() => togglePasswordVisibility(keyName)}>
            <Octicons
              name={passwordShown[keyName] ? "eye" : "eye-closed"} // Cambia el ícono
              size={hp(2.7)}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInputField;
