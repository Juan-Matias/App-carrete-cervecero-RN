import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from '../../conection/FireBaseConection/firebaseConfig.js';
import cliente from '../../sanity.js';
import { useNavigation } from '@react-navigation/native'; // Importar la navegación

const useFacturacionLogic = (cart, total, onClose, validateForm, formValues, isBartenderService, bartenderPrice) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [communes, setCommunes] = useState([]);
  const [barrels, setBarrels] = useState([]);
  const [additionalBarrelPrice, setAdditionalBarrelPrice] = useState(0); // Usar useState aquí
  const navigation = useNavigation(); // Usar el hook de navegación

  useEffect(() => {
    const fetchCommunes = async () => {
      const query = '*[_type == "comuna"]{name}';
      const result = await cliente.fetch(query);
      const sortedCommunes = result.map(comuna => ({
        label: comuna.name,
        value: comuna.name
      })).sort((a, b) => a.label.localeCompare(b.label));
      setCommunes(sortedCommunes);
    };

    const fetchBarrels = async () => {
      const query = '*[_type == "barrilAdicional"]{name, price}';
      const result = await cliente.fetch(query);
      const sortedBarrels = result.map(barril => ({
        label: `${barril.name} - $${barril.price}`,
        value: barril.name,
        price: barril.price
      })).sort((a, b) => a.label.localeCompare(b.label));
      setBarrels(sortedBarrels);
    };

    fetchCommunes();
    fetchBarrels();
  }, []);

  const formatCurrency = (amount) => {
    return amount.toLocaleString('es-ES', { style: 'currency', currency: 'CLP' });
  };

  const handleBarrelSelect = (value) => {
    if (value === null) {
      setSelectedProduct(null);
      setAdditionalBarrelPrice(0); // Resetear el precio adicional a 0
    } else {
      const selectedBarrel = barrels.find(barrel => barrel.value === value);
      if (selectedBarrel) {
        setSelectedProduct(value);
        setAdditionalBarrelPrice(selectedBarrel.price); // Asignar el precio del barril adicional
      }
    }
  };

  const handleFinalizarCompra = async () => {
    if (validateForm()) {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert('Error', 'Debes estar autenticado para realizar una compra.');
        return;
      }

      try {
        const purchaseData = {
          userId,
          address: formValues.address,
          phone: formValues.phone,
          city: formValues.selectedCity,
          date: formValues.selectedDate,
          time: formValues.selectedTime,
          items: cart.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: total + additionalBarrelPrice + (isBartenderService ? bartenderPrice : 0), // Asegúrate de sumar los precios correctamente
          createdAt: Timestamp.now()
        };

        // Guardar la compra en Firestore
        const docRef = await setDoc(doc(collection(db, 'facturacion'), userId), purchaseData);

        // Cerrar modal
        onClose();
        Alert.alert('Compra Exitosa', 'Tu compra fue procesada exitosamente.');
        navigation.navigate('Home');
      } catch (error) {
        Alert.alert('Error', `Error al procesar la compra: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Hay errores en el formulario. Por favor corrígelos.');
    }
  };

  return {
    communes,
    barrels,
    selectedProduct,
    handleFinalizarCompra,
    handleBarrelSelect,
    formatCurrency,
    additionalBarrelPrice
  };
};

export default useFacturacionLogic;
