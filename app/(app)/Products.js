import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
// Importaciones de componentes
import CardIProductos from "../../components/cart/CardProduct.js";
import SearchProducto from "../../components/search/SearchProducto.js";

export default function Productos() {
  const route = useRoute(); // Inicializa useRoute
  const categoryName = route?.params?.categoryName || ""; // Obtener el nombre de la categoría
  const [searchQuery, setSearchQuery] = useState(categoryName || "");
  // Ejemplo de uso de categoryName en una consulta o para filtrar productos
  useEffect(() => {
    if (categoryName) {
      setSearchQuery(categoryName); // Establece el valor de búsqueda con el nombre de la categoría
      console.log(`Filtrando productos por la categoría: ${categoryName}`);
    }
  }, [categoryName]);

  return (
    <ScrollView className=" flex-1">
      <StatusBar barStyle="dark-content" />

      {/* Buscador */}
      <SearchProducto
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Productos */}
      <View>
        <CardIProductos searchQuery={searchQuery} />
      </View>
    </ScrollView>
  );
}
