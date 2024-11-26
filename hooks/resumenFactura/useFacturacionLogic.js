import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../../conection/FireBaseConection/firebaseConfig.js";
import cliente from "../../sanity.js";
import { useNavigation } from "@react-navigation/native"; // Importar la navegación
import { useDispatch } from "react-redux"; // Importa useDispatch
import { useAuth } from "../../context/authContext.js";
import { clearCart, useCartContext } from "../CartContext/useCartContext.js";

const useFacturacionLogic = (
  cart,
  total,
  onClose,
  validateForm,
  formValues,
  isBartenderService,
  bartenderPrice
) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [communes, setCommunes] = useState([]);
  const [barrels, setBarrels] = useState([]);
  const [additionalBarrelPrice, setAdditionalBarrelPrice] = useState(0); // Usar useState aquí
  const navigation = useNavigation(); // Usar el hook de navegación
  const dispatch = useDispatch(); // Hook para despachar acciones de Redux
  const { clearCart } = useCartContext();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCommunes = async () => {
      const query = '*[_type == "comuna"]{name}';
      const result = await cliente.fetch(query);
      const sortedCommunes = result
        .map((comuna) => ({
          label: comuna.name,
          value: comuna.name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setCommunes(sortedCommunes);
    };

    const fetchBarrels = async () => {
      const query = '*[_type == "barrilAdicional"]{name, price}';
      const result = await cliente.fetch(query);
      const sortedBarrels = result
        .map((barril) => ({
          label: `${barril.name} - $${barril.price}`,
          value: barril.name,
          price: barril.price,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      setBarrels(sortedBarrels);
    };

    fetchCommunes();
    fetchBarrels();
  }, []);

  const formatCurrency = (amount) => {
    return amount.toLocaleString("es-ES", {
      style: "currency",
      currency: "CLP",
    });
  };

  const handleBarrelSelect = (value) => {
    if (value === null) {
      setSelectedProduct(null);
      setAdditionalBarrelPrice(0); // Resetear el precio adicional a 0
    } else {
      const selectedBarrel = barrels.find((barrel) => barrel.value === value);
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
        Alert.alert(
          "Error",
          "Debes estar autenticado para realizar una compra."
        );
        return;
      }

      // Agregar alerta de confirmación
      Alert.alert(
        "Confirmar Compra",
        "¿Realmente quieres hacer tu compra?",
        [
          {
            text: "No",
            onPress: () => console.log("Compra cancelada"),
            style: "cancel",
          },
          {
            text: "Sí",
            onPress: async () => {
              try {
                const purchaseData = {
                  userId,
                  address: formValues.address,
                  phone: formValues.phone,
                  city: formValues.selectedCity,
                  items: cart.map((item) => ({
                    id: item._id,
                    name: item.name,
                    price:
                      user && !user.isAnonymous && item.Descuento
                        ? item.price * (1 - item.Descuento)
                        : item.price,
                    quantity: item.quantity,
                  })),
                  total:
                    total +
                    additionalBarrelPrice +
                    (isBartenderService ? bartenderPrice : 0),
                };

                // Guardar la compra en Firestore
                await addDoc(collection(db, "facturacion"), purchaseData);

                // Limpiar Carrito
                clearCart();

                // Cerrar modal
                onClose();
                Alert.alert(
                  "Compra Exitosa",
                  "Tu compra fue procesada exitosamente."
                );
                navigation.navigate("Orders"); // Navega de vuelta a la pantalla de pedidos
              } catch (error) {
                Alert.alert(
                  "Error",
                  `Error al procesar la compra: ${error.message}`
                );
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        "Error",
        "Hay errores en el formulario. Por favor corrígelos."
      );
    }
  };

  return {
    communes,
    barrels,
    selectedProduct,
    handleFinalizarCompra,
    handleBarrelSelect,
    formatCurrency,
    additionalBarrelPrice,
  };
};

export default useFacturacionLogic;
