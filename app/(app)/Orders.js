import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../conection/FireBaseConection/firebaseConfig.js';
import { Card, Button } from 'react-native-paper'; // Para mostrar cada pedido en un Card y agregar un botón

import CardOrders from '../../components/cart/CardOrders.js'; // Importar el componente de las órdenes
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Tamaño de la imagen
const imageWidth = wp(72);
const imageHeight = hp(33);

const Pedidos = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert('Error', 'Debes estar autenticado para ver tus pedidos.');
      return;
    }

    setLoading(true); // Inicia la carga

    try {
      const q = query(collection(db, 'facturacion'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      const userOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(userOrders);

      if (userOrders.length === 0) {
        Alert.alert('Información', 'Todavía no se ha agregado ningún producto.');
      }
    } catch (error) {
      Alert.alert('Error', `Error al cargar los pedidos: ${error.message}`);
    } finally {
      setLoading(false); // Finaliza la carga
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <View className="flex-1 justify-center items-center p-4 bg-white">
      {orders.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4 bg-white">
          <Image
            source={require('../../assets/imagen-mascota/Cerveza-producto.png')}
            style={{ width: imageWidth, height: imageHeight }}
            resizeMode="contain"
          />
          <Text className="mt-4 text-lg font-semibold text-gray-700 text-center">
            ¡Mmmmmmm! Parece que aún no añades ningún pedido a tu carrito.
          </Text>

          <View className="pt-4">
            <Button
              mode="contained"
              onPress={fetchOrders}
              loading={loading}
              disabled={loading}
              className=" bg-amber-500 rounded-lg"
              labelStyle={{ color: 'white' }}
            >
              Actualizar
            </Button>
          </View>
        </View>
      ) : (
        
        <CardOrders orders={orders} onRefresh={fetchOrders} loading={loading} /> 
      )}
    </View>
  );
};

export default Pedidos;
