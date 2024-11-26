import { useState, useRef } from "react";

const useFormValidation = (initialValues, validations) => {
  const [formValues, setFormValues] = useState({
    ...initialValues,
    date: "", // Agregar fecha
    time: "", // Agregar hora
  });

  const [errors, setErrors] = useState({});

  // Referencias para los inputs
  const refs = {
    addressRef: useRef(null),
    phoneRef: useRef(null),
    dateRef: useRef(null),
    timeRef: useRef(null),
  };

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Si hay un error para este campo, lo eliminamos cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    // Validar cada campo usando las funciones de validación proporcionadas
    Object.keys(validations).forEach((field) => {
      if (validations[field]) {
        const error = validations[field](formValues[field]);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
      }
    });

    // Validaciones específicas para fecha y hora
    if (!formValues.date) {
      newErrors.date = "La fecha es requerida";
      isValid = false;
    }

    if (!formValues.time) {
      newErrors.time = "La hora es requerida";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    formValues,
    errors,
    handleInputChange,
    validateForm,
    refs,
  };
};

export default useFormValidation;
