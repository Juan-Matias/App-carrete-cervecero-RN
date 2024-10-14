import React, { useState, useEffect } from "react";
import { View, Text, Keyboard } from "react-native";
import TabBarButton from "./TarBarButton"; 
import { useSelector } from "react-redux";

export default function TabBar({ state, descriptors, navigation }) {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Listener para detectar cuando el teclado aparece y desaparece
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Productos del carrito desde Redux
  const cartItems = useSelector((state) => state.cart.items);

  const primaryColor = "#0891b2";
  const greyColor = "#737373";
  const colorTabBar = "#ffffff";

  // Obtener el total de productos en el carrito
  const getTotalProductos = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const totalProductos = getTotalProductos();

  // Ocultar el TabBar si el teclado está visible
  if (isKeyboardVisible) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: colorTabBar,
        borderColor: greyColor,
        borderWidth: 0.5,
      }}
      className="flex-row justify-between items-center py-4 shadow-black shadow-lg rounded-2xl"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : greyColor}
            label={label}
            className="flex-1"
          />
        );
      })}

      {/* Mostrar el contador de productos solo si hay productos en el carrito */}
      {totalProductos > 0 && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 88,
            backgroundColor: "red",
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {totalProductos}
          </Text>
        </View>
      )}
    </View>
  );
}
