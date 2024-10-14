import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';

// Importaciones de componentes
import CardIProductos from '../../components/cart/CardProduct.js';
import SearchProducto from '../../components/search/SearchProducto.js';

export default function Productos() {
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la consulta de búsqueda

  return (
    <ScrollView className="bg-white flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Buscador */}
      <SearchProducto searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Productos */}
      <View style={{ paddingTop: hp(2) }}>
        <CardIProductos searchQuery={searchQuery} />
      </View>
    </ScrollView>
  );
}
