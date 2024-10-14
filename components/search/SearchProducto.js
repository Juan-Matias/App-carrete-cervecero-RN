import React from 'react';
import { View, TextInput } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';

const SearchProducto = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={{ paddingTop: hp(2) }}>
      <View className="flex-row items-center space-x-2 px-4 pb-">
        <View className="flex-row flex-1 items-center p-3 rounded-3xl border border-gray-300">
          <Octicons name="search" size={hp(2.2)} />
          <TextInput
            placeholder='Buscador'
            className="ml-2 flex-1 text-base"
            value={searchQuery}
            onChangeText={setSearchQuery} // Actualizar el estado con el texto de búsqueda
          />
        </View>
      </View>
    </View>
  );
};

export default SearchProducto;
