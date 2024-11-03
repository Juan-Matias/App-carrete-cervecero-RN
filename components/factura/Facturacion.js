import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation
import CustomKeyboardView from '../keyboard/CustomKeyboardView.js';
import DateTimeSelector from '../dateTime/DateTimePickerModal.js';

import useFormValidation from '../../hooks/resumenFactura/useFormValidation.js';
import useFacturacionLogic from '../../hooks/resumenFactura/useFacturacionLogic.js';

import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const Facturacion = ({ isVisible, onClose, cart, total, onCompraFinalizada }) => {
  const navigation = useNavigation(); // Inicializar la navegación
  const { formValues, errors, handleInputChange, validateForm, refs } = useFormValidation({
    address: '',
    phone: '',
    selectedCity: '',
    selectedDate: '',
    selectedTime: ''
  });

  const bartenderPrice = 15000; // Precio del servicio de bartender
  const [isBartenderService, setIsBartenderService] = useState(false); // Estado para el servicio de bartender
  
  // Lógica de facturación
  const {
    communes,
    barrels,
    selectedProduct,
    handleFinalizarCompra,
    handleBarrelSelect,
    formatCurrency,
    additionalBarrelPrice
  } = useFacturacionLogic(cart, total, onClose, validateForm, formValues, isBartenderService, bartenderPrice);

  // Calcular total
  const totalCost = total + additionalBarrelPrice + (isBartenderService ? bartenderPrice : 0);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      avoidKeyboard={true}
      style={{ justifyContent: 'flex-end', margin: 10, }}
    >
      <CustomKeyboardView>
        <View className="bg-white p-4 rounded-t-lg pt-10">
          <Text className="text-lg font-semibold mb-4">Dirección de Envio</Text>
          
          {/* Input para dirección y número */}
          <View className="flex-row gap-2 justify-center ">
            <TextInput
              ref={refs.addressRef}
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder='Dirección de Envio'
              value={formValues.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <TextInput
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder='Número'
              value={formValues.houseNumber}
              onChangeText={(value) => handleInputChange('houseNumber', value)}
            />
            <View className="flex-1 rounded-lg bg-gray-100">
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('selectedCity', value)}
                placeholder={{ label: 'Seleccionar Ciudad', value: null }}
                items={communes}
              />
            </View>
          </View>
          {errors.city && <Text style={{ color: 'red' }}>{errors.city}</Text>}

          {/* Input para teléfono */}
          <View className="pt-2 bg-white rounded-t-lg">
            <TextInput
              ref={refs.phoneRef}
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder='Teléfono'
              value={formValues.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone && <Text style={{ color: 'red' }}>{errors.phone}</Text>}

          {/* Servicio de Bartender */}
          <View className="pt-6 flex-row items-center justify-between">
            <View className="flex-col">
              <Text className="text-lg font-semibold">* Servicio de Bartender</Text>
              <Text className="text-base font-normal pl-4"> Precio {formatCurrency(bartenderPrice)} (Opcional)</Text>
            </View>
            <CheckBox
              checked={isBartenderService}
              onPress={() => setIsBartenderService(!isBartenderService)}
            />
          </View>

          {/* Barril adicional */}
          <View className="pt-6 flex-col">
            <Text className="text-lg font-semibold">* Seleccionar Barril adicional</Text>
            <Text className="text-base font-normal pl-4">Servicio (Opcional)</Text>
            <View className="rounded-lg bg-gray-100 mt-2">
              <RNPickerSelect
                onValueChange={handleBarrelSelect}
                placeholder={{ label: 'Seleccionar Barril', value: null }}
                items={barrels}
              />
            </View>
          </View>

           {/* Selección de fecha y hora */}
           <View className="pt-8 flex-col items-center" >
            <Text className="text-xl font-semibold ">🕓 Horario de Envio</Text>
            
            <View className="flex-row pt-2 justify-center ">
              <View className="m-1">
              <DateTimeSelector
                mode="date"
                label="Seleccionar Fecha"
                onConfirm={(value) => handleInputChange('selectedDate', value)}
              />
              </View>

              <View className="m-1">
              <DateTimeSelector
                mode="time"
                label="Seleccionar Hora"
                onConfirm={(value) => handleInputChange('selectedTime', value)}
              />
              </View>
            </View>

          </View>
          {errors.date && <Text style={{ color: 'red' }}>{errors.date}</Text>}
          {errors.time && <Text style={{ color: 'red' }}>{errors.time}</Text>}

          {/* Sección de Facturación */}
          <View style={{paddingTop:hp(2)}}>
          <View className="border rounded-lg p-4 mt-5 " >
            <Text className="text-lg font-semibold mb-4">Facturación</Text>
            
            {cart.map((item) => (
              <View className="flex-row justify-between mb-2" key={item._id}>
                <Text>{item.quantity} x {item.name}</Text>
                <Text>{formatCurrency(item.price)}</Text>
              </View>
            ))}

            {isBartenderService && (
              <View className="flex-row justify-between mb-2">
                <Text>Servicio de Bartender</Text>
                <Text>{formatCurrency(bartenderPrice)}</Text>
              </View>
            )}

            {additionalBarrelPrice > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text>Barril adicional</Text>
                <Text>{formatCurrency(additionalBarrelPrice)}</Text>
              </View>
            )}

            <View className="flex-row justify-between mb-2">
              <Text className="text-lg font-semibold">Total</Text>
              <Text className="text-lg font-semibold">
                {formatCurrency(totalCost)}
              </Text>
            </View>
          </View>
          </View>
          {/* Botón de finalizar compra */}
          <View style={{paddingTop:hp(2)}}>
          <View className="mt-6 bg-amber-500 rounded-lg" >
            <Button onPress=
            {handleFinalizarCompra}
        
            >
            <Text className="text-base font-bold text-white">Finalizar Compra</Text>
            </Button>
          </View>
          </View>
        </View>
      </CustomKeyboardView>
    </Modal>
  );
};

export default Facturacion;
