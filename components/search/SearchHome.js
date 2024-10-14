import React from 'react';
import { View, TextInput, Text, Modal, TouchableOpacity } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SearchHome = ({ searchQuery, setSearchQuery, modalVisible, setModalVisible }) => {
  // Función para cerrar el modal
  const onClose = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ paddingTop: hp(2) }}>
      {/* Search bar */}
      <View className="flex-row items-center space-x-2 px-4 ">
        <View className="flex-row flex-1 items-center p-2.5 rounded-full border border-gray-300">
          {/* Icono de búsqueda */}
          <Feather name="search" size={22} color="gray" style={{ paddingLeft: 8 }} />
          
          {/* Input de búsqueda */}
          <TextInput
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="ml-2 flex-1 font-normal text-zinc-700 text-base"
          />
        </View>
        
        {/* Icono de promociones */}
        <TouchableOpacity 
          className="flex-row p-2.5 rounded-full bg-amber-500 justify-center items-center w-26"
          onPress={() => setModalVisible(true)} // Mostrar el popup al presionar
        >
          <MaterialCommunityIcons name="star-circle-outline" size={30} color="white" />
          <Text className="p-1 text-white font-semibold text-sm">Promo</Text>
        </TouchableOpacity>
      </View>

      {/* Popup de promociones */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onClose} // Cerrar el popup al presionar atrás
      >
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          activeOpacity={1} // Hace que el área fuera del modal sea presionable
          onPress={onClose} // Cerrar el popup al presionar fuera
        >
          <View style={{ width: '80%', backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
            {/* Ícono de cerrar dentro del popup */}
            <TouchableOpacity 
              style={{ position: 'absolute', top: 20, right: 20 }} // Ubicación de la "X"
              onPress={onClose} // Cerrar el popup al presionar "X"
            >
              <Text style={{ fontSize: 24, color: 'black' }}>✖</Text>
            </TouchableOpacity>

            <Text className="text-lg font-bold text-center">¡Promociones!</Text>
            <Text className="text-center" style={{ marginVertical: 10 }}>
              Aquí están tus promociones disponibles.
            </Text>
            <TouchableOpacity 
              onPress={onClose} // Cerrar el popup al presionar
              style={{ backgroundColor: 'amber', borderRadius: 5, padding: 10 }}
            >
              <Text className="text-center text-white">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SearchHome;
