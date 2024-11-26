import React, { useState, useMemo, useCallback } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { Button } from "react-native-paper";
import Modal from "react-native-modal";
import { CheckBox } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from 'react-i18next';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomKeyboardView from "../keyboard/CustomKeyboardView.js";
import DateTimePicker from '@react-native-community/datetimepicker';

import useFormValidation from "../../hooks/resumenFactura/useFormValidation.js";
import useFacturacionLogic from "../../hooks/resumenFactura/useFacturacionLogic.js";
import { useAuth } from "../../context/authContext.js";
import '../../config/i18n';

const Facturacion = ({
  isVisible,
  onClose,
  cart,
  total,
  onCompraFinalizada,
}) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  };

  const { formValues, errors, handleInputChange, validateForm, refs } =
    useFormValidation({
      address: "",
      phone: "",
      selectedCity: "",
      date: "",
      time: "",
    }, {
      address: (value) => {
        if (!value) return t('facturacion.errores.direccionRequerida');
        if (value.length < 5) return t('facturacion.errores.direccionMinima');
        return null;
      },
      phone: (value) => {
        if (!value) return t('facturacion.errores.telefonoRequerido');
        if (!validatePhoneNumber(value)) return t('facturacion.errores.telefonoInvalido');
        return null;
      },
      selectedCity: (value) => {
        if (!value) return t('facturacion.errores.ciudadRequerida');
        return null;
      },
      date: (value) => {
        if (!value) return "La fecha es requerida";
        return null;
      },
      time: (value) => {
        if (!value) return "La hora es requerida";
        return null;
      }
    });

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleInputChange("date", formattedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      handleInputChange("time", formattedTime);
    }
  };

  const bartenderPrice = 15000; // Precio del servicio de bartender
  const [isBartenderService, setIsBartenderService] = useState(false);
  const { user } = useAuth();

  const {
    communes,
    barrels,
    selectedProduct,
    handleFinalizarCompra,
    handleBarrelSelect,
    formatCurrency,
    additionalBarrelPrice,
  } = useFacturacionLogic(
    cart,
    total,
    onClose,
    validateForm,
    formValues,
    isBartenderService,
    bartenderPrice
  );

  const totalCost =
    total + additionalBarrelPrice + (isBartenderService ? bartenderPrice : 0);

  const memoizedCommunes = useMemo(() => communes, [communes]);
  const memoizedBarrels = useMemo(() => barrels, [barrels]);

  const handleFinalizarCompraAsync = async () => {
    try {
      setIsLoading(true);
      await handleFinalizarCompra();
    } catch (error) {
      Alert.alert(
        "Error",
        "Ha ocurrido un error al procesar tu compra. Por favor, intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      avoidKeyboard={true}
      style={{ justifyContent: "flex-end", margin: 10 }}
    >
      <CustomKeyboardView>
        <View className="bg-white p-4 rounded-t-lg pt-10">
          <Spinner visible={isLoading} />
          <Text className="text-lg font-semibold mb-4">{t('facturacion.titulo')}</Text>
          
          {/* Campos de fecha y hora */}
          <View className="flex-row gap-2 justify-between mb-4">
            <View className="flex-1">
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                className="bg-gray-100"
              >
                {formValues.date || "Seleccionar Fecha"}
              </Button>
              {errors.date && (
                <Text className="text-red-500 text-sm">{errors.date}</Text>
              )}
            </View>
            <View className="flex-1">
              <Button
                mode="outlined"
                onPress={() => setShowTimePicker(true)}
                className="bg-gray-100"
              >
                {formValues.time || "Seleccionar Hora"}
              </Button>
              {errors.time && (
                <Text className="text-red-500 text-sm">{errors.time}</Text>
              )}
            </View>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formValues.date ? new Date(formValues.date) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={formValues.time ? new Date(`2000-01-01T${formValues.time}`) : new Date()}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <View className="flex-row gap-2 justify-center">
            <TextInput
              ref={refs.addressRef}
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder={t('facturacion.direccion')}
              value={formValues.address}
              onChangeText={(value) => handleInputChange("address", value)}
              accessibilityLabel={t('facturacion.direccion')}
              accessibilityHint="Ingresa tu dirección de envío"
              aria-invalid={!!errors.address}
            />
            <TextInput
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder={t('facturacion.numero')}
              value={formValues.houseNumber}
              onChangeText={(value) => handleInputChange("houseNumber", value)}
              accessibilityLabel={t('facturacion.numero')}
              keyboardType="numeric"
            />
            <View className="flex-1 rounded-lg bg-gray-100">
              <Picker
                selectedValue={formValues.selectedCity}
                onValueChange={(value) => handleInputChange("selectedCity", value)}
                accessibilityLabel="Seleccionar ciudad"
              >
                {memoizedCommunes.map((commune) => (
                  <Picker.Item
                    label={commune.label}
                    value={commune.value}
                    key={commune.value}
                  />
                ))}
              </Picker>
            </View>
          </View>
          {errors.city && (
            <Text className="text-red-500" accessibilityRole="alert">
              {errors.city}
            </Text>
          )}

          <View className="pt-2 bg-white rounded-t-lg">
            <TextInput
              ref={refs.phoneRef}
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder={t('facturacion.telefono')}
              value={formValues.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              keyboardType="phone-pad"
              accessibilityLabel={t('facturacion.telefono')}
              accessibilityHint="Ingresa tu número de teléfono"
              aria-invalid={!!errors.phone}
            />
          </View>
          {errors.phone && (
            <Text className="text-red-500" accessibilityRole="alert">
              {errors.phone}
            </Text>
          )}

          <View className="pt-6 flex-row items-center justify-between">
            <View className="flex-col">
              <Text className="text-lg font-semibold">
                * {t('facturacion.bartenderService.titulo')}
              </Text>
              <Text className="text-base font-normal pl-4">
                {t('facturacion.bartenderService.descripcion')} {formatCurrency(bartenderPrice)} (Opcional)
              </Text>
            </View>
            <CheckBox
              checked={isBartenderService}
              onPress={() => setIsBartenderService(!isBartenderService)}
            />
          </View>

          <View className="pt-6 flex-col">
            <Text className="text-lg font-semibold">
              * {t('facturacion.barrilAdicional.titulo')}
            </Text>
            <Text className="text-base font-normal pl-4">
              {t('facturacion.barrilAdicional.descripcion')} (Opcional)
            </Text>
            <View className="rounded-lg bg-gray-100 mt-2">
              <Picker
                selectedValue={formValues.selectedBarrel}
                onValueChange={(value) => handleBarrelSelect(value)}
                className="h-12"
              >
                <Picker.Item label={t('facturacion.barrilAdicional.seleccionar')} value={null} />
                {memoizedBarrels.map((barrel) => (
                  <Picker.Item
                    key={barrel.value}
                    label={barrel.label}
                    value={barrel.value}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View className="pt-4">
            <View className="border rounded-lg p-4 mt-5">
              <Text className="text-lg font-semibold mb-4">{t('facturacion.facturacion.titulo')}</Text>
              {cart.map((item) => (
                <View className="flex-row justify-between mb-2" key={item._id}>
                  <Text>
                    {item.quantity} x {item.name}
                  </Text>
                  <Text>
                    {user && !user.isAnonymous
                      ? formatCurrency(item.price * (1 - (item.Descuento || 0)))
                      : formatCurrency(item.price)}
                  </Text>
                </View>
              ))}
              {isBartenderService && (
                <View className="flex-row justify-between mb-2">
                  <Text>{t('facturacion.bartenderService.titulo')}</Text>
                  <Text>{formatCurrency(bartenderPrice)}</Text>
                </View>
              )}
              {additionalBarrelPrice > 0 && (
                <View className="flex-row justify-between mb-2">
                  <Text>{t('facturacion.barrilAdicional.titulo')}</Text>
                  <Text>{formatCurrency(additionalBarrelPrice)}</Text>
                </View>
              )}
              <View className="flex-row justify-between mb-2">
                <Text className="text-lg font-semibold">{t('facturacion.facturacion.total')}</Text>
                <Text className="text-lg font-semibold">
                  {formatCurrency(totalCost)}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-6 bg-amber-500 rounded-lg">
            <Button 
              onPress={handleFinalizarCompraAsync}
              disabled={isLoading}
              accessibilityRole="button"
              accessibilityLabel={t('facturacion.finalizarCompra')}
            >
              <Text className="text-base font-bold text-white">
                {t('facturacion.finalizarCompra')}
              </Text>
            </Button>
          </View>
        </View>
      </CustomKeyboardView>
    </Modal>
  );
};

export default Facturacion;
