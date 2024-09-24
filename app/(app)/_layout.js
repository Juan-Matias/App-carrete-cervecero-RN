import React from 'react';
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { Ionicons } from 'react-native-vector-icons';
import TabBar from '../../components/tabs/Tarbar.js'; 

export default function Layout() {
  const router = useRouter();

  return (
    <Tabs
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerStyle: {
          height: 120,
          //backgroundColor: "#FFDF8A", 
          //borderRadius: 20,
        },
        headerTitleStyle: {
          fontSize: 30,
         
        },
        headerTitleAlign: 'left',
        tabBarHideOnKeyboard: true,
        headerShown: true,
        headerRight: () => (
          <Ionicons 
            name="person-circle-outline" 
            size={40} 
            color="black" 
            style={{ marginRight: 20}} 
            onPress={() => router.push("Profile")} // Lleva a la pantalla de perfil
          />
        ),
      }}
    >
      <Tabs.Screen name='Home' options={{ title: "Home" }} />
      <Tabs.Screen name='Products' options={{ title: "Productos" }} />
      <Tabs.Screen name='Orders' options={{ title: "Pedidos" }} />
      <Tabs.Screen name='Cart' options={{ title: "Carrito" }} />
      <Tabs.Screen name='Profile' options={{ title: "Perfil" }} />
    </Tabs>
  );
}
