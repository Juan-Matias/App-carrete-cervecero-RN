import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/authContext';

const useSignInLogic = () => {
  // Estados para manejar los errores, la carga y los mensajes de alerta
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Refs para manejar los valores de entrada y el enfoque de los campos
  const emailRef = useRef('');
  const passwordRef = useRef('');
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Hook para la navegación
  const router = useRouter();

  // Hook para la autenticación
  const { login } = useAuth();

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    // Validación de campos
    let validationErrors = {};

    // Validación del correo electrónico
    if (!emailRef.current) {
      validationErrors.email = "Por favor, ingresa tu correo";
      emailInputRef.current?.focus(); // Enfoca el campo de correo electrónico
    } else if (!/\S+@\S+\.\S+/.test(emailRef.current)) {
      validationErrors.email = "Por favor, ingresa un correo válido";
      emailInputRef.current?.focus(); // Enfoca el campo de correo electrónico
    }

    // Validación de la contraseña
    if (!passwordRef.current) {
      validationErrors.password = "Por favor, ingresa tu contraseña";
      if (!validationErrors.email) {
        passwordInputRef.current?.focus(); // Enfoca el campo de contraseña si no hay error en el email
      }
    }

    // Si hay errores de validación, actualiza el estado y muestra el mensaje de alerta
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAlertMessage(Object.values(validationErrors).join('\n'));
      return;
    }

    // Establece el estado de carga en verdadero
    setLoading(true);

    try {
      // Intenta iniciar sesión con las credenciales proporcionadas
      const response = await login(emailRef.current, passwordRef.current);

      // Manejo de la respuesta del inicio de sesión
      if (response.success) {
        router.push('/Home'); // Redirige al usuario a la página de inicio
      } else {
        let errorMessage = '';
        
        switch (response.message) {
          case 'auth/wrong-password':
            errorMessage = "Contraseña incorrecta. Por favor, inténtalo de nuevo.";
            setErrors({ password: errorMessage });
            passwordInputRef.current?.focus(); // Enfoca el campo de contraseña
            break;

          case 'auth/user-not-found':
            errorMessage = "No se encontró un usuario con este correo electrónico.";
            setErrors({ email: errorMessage });
            emailInputRef.current?.focus(); // Enfoca el campo de correo electrónico
            break;

          default:
            errorMessage = response.message || "Ocurrió un error durante el inicio de sesión.";
            setErrors({ general: errorMessage });
            break;
        }
        setAlertMessage(errorMessage); // Establece el mensaje de alerta
      }
    } catch (error) {
      // Manejo de errores durante el proceso de inicio de sesión
      setAlertMessage(`Error: ${error.message}`);
      setErrors({ general: `Error: ${error.message}` });
    } finally {
      // Establece el estado de carga en falso al finalizar el proceso
      setLoading(false);
    }
  };

  // Retorna los valores y funciones necesarias para el componente SignInUI
  return {
    emailInputRef,
    passwordInputRef,
    emailRef,
    passwordRef,
    errors,
    setErrors,
    loading,
    alertMessage,
    handleLogin,
    setAlertMessage,
  };
};

export default useSignInLogic;
