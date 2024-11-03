import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux'; // Importa Provider
import { View, ActivityIndicator } from 'react-native'; // Asegúrate de importar View y ActivityIndicator
import { store } from '../redux/store.js'; // Ajusta la ruta según tu estructura
import { AuthContextProvider, useAuth } from '../context/authContext'; // Ajusta la ruta si es necesario
import { CartContextProvider } from '../hooks/CartContext/useCartContext.js'; // Ajusta la ruta si es necesario
import { Slot, useRouter, useSegments } from 'expo-router';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof isAuthenticated !== 'undefined') {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (loading) return;
    
    const inApp = segments[0] === 'app';

    if (isAuthenticated && !inApp) {
      router.replace('Home');
      console.log('Pantalla Home');
    } else if (isAuthenticated === false) {
      router.replace('HomeScreen');
      console.log('Pantalla HomeScreen');
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  return (
    <Slot />
  );
};

export default function RootLayout() {
  return (
    <Provider store={store}> 
      <AuthContextProvider>
        <CartContextProvider>
          <MainLayout />
        </CartContextProvider>
      </AuthContextProvider>
    </Provider>
  );
}
