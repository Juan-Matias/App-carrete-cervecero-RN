// CardCarrito.js
import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../slider/cartSlice.js';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Tamaño de la imagen
const imageWidth = wp(54);
const imageHeight = hp(17);

const CardCarrito = ({ item }) => {
    const dispatch = useDispatch();

    return (
        <View className="m-2 p-2 rounded-lg bg-gray-50 flex-row items-center" style={{ height: hp(15) }}>
            {/* Imagen del producto */}
            <Image
                source={{ uri: item.image.asset.url }} // Asegúrate de que la URL de la imagen sea válida
                style={{ width: wp(38), height: hp(12) }}
                className="rounded-xl"
                resizeMode="cover"
            />

            {/* Texto - nombre y precio */}
            <View className="pl-4">
                <Text className="text-lg font-semibold ">{item.name || 'Nombre no disponible'}</Text>

                <Text className="text-base mt-2">
                    {item.price ? `$${item.price.toLocaleString('es-ES')}` : 'Precio no disponible'}
                </Text>
                
                {/* Contador de cantidad */}
                <View className="items-center justify-between mt-3 flex-row">
                    {/* Botón para disminuir la cantidad */}
                    <TouchableOpacity
                        onPress={() => dispatch(removeFromCart(item._id))} // Disminuir cantidad
                        disabled={item.quantity <= 0}
                    >
                        <AntDesign name="minuscircle" size={hp(2.7)} color={"grey"} />
                    </TouchableOpacity>

                    {/* Mostrar la cantidad actual */}
                    <Text className="text-lg ">{item.quantity}</Text>

                    {/* Botón para aumentar la cantidad */}
                    <TouchableOpacity
                        onPress={() => dispatch(addToCart(item))} // Aumentar cantidad
                    >
                        <AntDesign name="pluscircle" size={hp(2.7)} color={"#E8A500"} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default CardCarrito;
