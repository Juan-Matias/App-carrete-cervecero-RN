import { useState, useRef } from 'react';

const useFormValidation = (initialState) => {
  const [formValues, setFormValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Referencias para los inputs
  const addressRef = useRef(null);
  const phoneRef = useRef(null);
  const cityRef = useRef(null);
  const dateRef = useRef(null);
  const timeRef = useRef(null);

  // Función para manejar los cambios en los inputs
  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  // Función para validar el formulario y hacer focus en el primer campo con error
  const validateForm = () => {
    const newErrors = {};

    // Validar campos en un solo 'if-else' con focus
    if (!formValues.address) {
      newErrors.address = 'La dirección de envío es obligatoria.';
      addressRef.current?.focus(); // Hacer focus en el campo de dirección
    } else if (!formValues.phone || !/^\d{9}$/.test(formValues.phone)) {
      newErrors.phone = 'Número de teléfono no válido. Debe tener 9 dígitos.';
      phoneRef.current?.focus(); // Hacer focus en el campo de teléfono
    } else if (!formValues.selectedCity) {
      newErrors.city = 'Debe seleccionar una ciudad.';
      cityRef.current?.focus(); // Hacer focus en el campo de ciudad
    } else if (!formValues.selectedDate) {
      newErrors.date = 'Debe seleccionar una fecha de envío.';
      dateRef.current?.focus(); // Hacer focus en el campo de fecha
    } else if (!formValues.selectedTime) {
      newErrors.time = 'Debe seleccionar una hora de envío.';
      timeRef.current?.focus(); // Hacer focus en el campo de hora
    }

    setErrors(newErrors);

    // Si no hay errores, retorna true, de lo contrario false
    return Object.keys(newErrors).length === 0;
  };

  return {
    formValues,
    errors,
    handleInputChange,
    validateForm,
    // Exponemos las referencias para poder asignarlas a los inputs en el componente
    refs: {
      addressRef,
      phoneRef,
      cityRef,
      dateRef,
      timeRef
    }
  };
};

export default useFormValidation;
