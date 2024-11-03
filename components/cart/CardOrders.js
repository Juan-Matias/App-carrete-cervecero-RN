import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { Card, Button } from 'react-native-paper'; // Para mostrar cada pedido en un Card y agregar un botón
import { FontAwesome } from '@expo/vector-icons'; 

const CardOrders = ({ orders, onRefresh, loading }) => {
  const [expandedOrderIds, setExpandedOrderIds] = useState([]); // Controla las órdenes expandidas

  // Función para alternar la expansión del pedido
  const toggleExpandOrder = (orderId) => {
    if (expandedOrderIds.includes(orderId)) {
      setExpandedOrderIds(expandedOrderIds.filter((id) => id !== orderId)); // Contrae si ya está expandido
    } else {
      setExpandedOrderIds([...expandedOrderIds, orderId]); // Expande si no lo está
    }
  };

  // Función para ordenar pedidos por ID (si son numéricos)
  const sortedOrders = orders.sort((a, b) => a.id - b.id);

  // Función para formatear números
  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  // Renderizado de cada elemento del pedido
  const renderOrderItem = ({ item, index }) => {
    const isExpanded = expandedOrderIds.includes(item.id);

    // Generar un ID más fácil de usar (usando el índice)
    const simpleId = `Pedido #${index + 1}`; // Puedes personalizar esto según sea necesario

    return (
      <Card style={{ marginVertical: 10 }} className="bg-gray-50">
        <Card.Title 
          title={
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name="book" size={25} color="black" />
              <Text className="text-lg text-zinc-700 font-bold" style={{ marginLeft: 8 }}>{simpleId}</Text>
            </View>
          } 
        />
        <Card.Content>
          <Text className="text-base">Dirección: {item.address}</Text>
          <Text className="text-base font-bold text-zinc-700">Total: ${formatNumber(item.total)}</Text>
        </Card.Content>
        <Card.Actions>
          <Button
            onPress={() => toggleExpandOrder(item.id)}
            textColor="#1C1C1C" // Cambia este color al deseado
          >
            {isExpanded ? 'Ocultar detalles' : 'Mostrar detalles'}
          </Button>
        </Card.Actions>
        {isExpanded && (
          <Card.Content>
              <Text className="text-base font-bold text-red-600">REGISTRO:</Text>
              
              <Text className="text-base">Teléfono: {item.phone}</Text>
              <Text className="text-base">Ciudad: {item.city}</Text>
              <Text className="text-base">Fecha: {item.date}</Text>
              <Text className="text-base">Hora: {item.time}</Text>
          
            <FlatList
              data={item.items}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Text>{`${item.quantity}x ${item.name} - $${formatNumber(item.price)}`}</Text>
              )}
            />
          </Card.Content>
        )}
      </Card>
    );
  };

  return (
    <View>
      {/* FlatList con pedidos ordenados */}
      <FlatList
        data={sortedOrders} // Utiliza la lista de pedidos ordenados
        renderItem={renderOrderItem}
        keyExtractor={(item, index) => index.toString()} // Usar el índice como clave
        className="w-96"
      />
      {/* Botón debajo del FlatList */}
      <Button
        className="bg-amber-500 rounded-lg"
        mode="contained"
        onPress={onRefresh}
        loading={loading}
        disabled={loading}
        style={{ marginVertical: 10 }}
      >
        Actualizar
      </Button>
    </View>
  );
};

export default CardOrders;
