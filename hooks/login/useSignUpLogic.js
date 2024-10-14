import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/authContext';

const useSignUpLogic = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Refs para manejar los valores y el enfoque de los campos de entrada
  const refs = {
    username: useRef(''), // Cambiado a un string en lugar de null
    email: useRef(''),
    telefono: useRef(''),
    password: useRef(''),
    confirmPassword: useRef(''), // Cambiar este nombre
  };

  const router = useRouter();
  const { register } = useAuth();

  // Validaciones de los inputs
  const validations = {
    email: (value) => /\S+@\S+\.\S+/.test(value) ? "" : "Por favor, introduce un correo electrónico válido",
    username: (value) => value ? "" : "Ingrese su nombre completo",
    telefono: (value) => /^\d+$/.test(value) ? "" : "Por favor, introduce un número de teléfono válido",
    password: (value) => value ? "" : "Por favor, introduce tu contraseña",
    confirmPassword: (value) => value === refs.password.current ? "" : "Las contraseñas no coinciden",
  };

  // Manejo del registro
  const handleRegister = async () => {
    let validationErrors = {};
    let firstErrorKey = null;

    // Validar los campos y capturar el primer error
    for (const key in refs) {
      const value = refs[key].current; // Asegúrate de que se obtiene el valor correctamente
      const errorMessage = validations[key](value);
      if (errorMessage) {
        validationErrors[key] = errorMessage;
        if (!firstErrorKey) firstErrorKey = key; // Captura la primera clave con error
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAlertMessage("Todos los campos son obligatorios");

      // Enfocar el primer campo con error
      if (firstErrorKey && refs[firstErrorKey].current) {
        refs[firstErrorKey].current.focus();
      }

      return;
    }

    setLoading(true);

    try {
      if (!register) {
        throw new Error("register function is not defined in useAuth");
      }

      const response = await register(refs.email.current, refs.password.current, 'defaultProfileUrl');

      if (response.success) {
        router.push('/SignInScreen');
      } else {
        setAlertMessage(response.message || "Ocurrió un error durante el registro.");
        setErrors({ general: response.message || "Ocurrió un error durante el registro." });
      }
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setErrors({ general: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return {
    refs,
    errors,
    setErrors,
    loading,
    alertMessage,
    setAlertMessage,
    handleRegister,
  };
};

export default useSignUpLogic;
