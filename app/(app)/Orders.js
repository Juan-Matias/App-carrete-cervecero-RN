import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../conection/FireBaseConection/firebaseConfig.js';

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
      return; // Si no está autenticado, no hacemos nada
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

    } catch (error) {
      console.error('Error al cargar los pedidos:', error);
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
        </View>
      ) : (
        <CardOrders orders={orders} onRefresh={fetchOrders} loading={loading} /> 
      )}
    </View>
  );
};

export default Pedidos;
