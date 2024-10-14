import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
  updateProfile, // Para actualizar el perfil del usuario (nombre)
  updatePassword, // Para actualizar la contraseña
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";


import React, { createContext, useState, useEffect, useContext } from "react";
import { auth, db } from "../conection/FireBaseConection/firebaseConfig.js";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; 
// Definir y exportar AuthContext
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = user.isAnonymous
            ? null
            : await updateUserData(user.uid);
          setUser(
            user.isAnonymous
              ? { ...user, username: "Guest" }
              : { ...user, ...userData }
          );
          setIsAuthenticated(true);
        } catch (error) {
          console.error(
            "Error al cargar los datos del usuario: ",
            error.message
          );
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return unSub;
  }, []);

  const updateUserData = async (userId) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        username: data.username,
        profileUrl: data.profileUrl,
        userId: data.userId,
      };
    } else {
      throw new Error("No se encontraron datos de usuario");
    }
  };

  // Función para actualizar el nombre de usuario
  const updateUserName = async (newName) => {
    try {
      if (!auth.currentUser) throw new Error("No hay usuario autenticado");

      // Actualizar el nombre en Firebase Auth
      await updateProfile(auth.currentUser, { displayName: newName });

      // Actualizar el nombre en Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, { username: newName });

      // Actualizar el estado del usuario
      setUser((prevUser) => ({
        ...prevUser,
        displayName: newName,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error al actualizar el nombre de usuario:", error.message);
      return { success: false, message: error.message };
    }
  };


  // En tu archivo authContext.js
  // Re - autenticacion para la contraseña
  const reauthenticateUser = async (email, password) => {
    try {
      const user = auth.currentUser; // Usuario actual
      const credential = EmailAuthProvider.credential(email, password); // Credenciales del usuario
      await reauthenticateWithCredential(user, credential); // Re-autenticación
      return { success: true };
    } catch (error) {
      console.error("Error al re-autenticar el usuario: ", error.message);
      return { success: false, message: error.message };
    }
  };

  // Función para actualizar la contraseña
  const updateUserPassword = async (newPassword) => {
    try {
      if (!auth.currentUser) throw new Error("No hay usuario autenticado");

      // Actualizar la contraseña en Firebase Auth
      await updatePassword(auth.currentUser, newPassword);

      return { success: true };
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error.message);
      return { success: false, message: error.message };
    }
  };

  // Nueva función para recargar los datos del usuario
  const refreshUserData = async () => {
    if (user && user.uid) {
      const userData = await updateUserData(user.uid);
      setUser({ ...user, ...userData });
    }
  };

  const login = async (email, password) => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const userData = await updateUserData(response.user.uid);
      setUser({ ...response.user, ...userData });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Error en el inicio de sesión: ", error.message);
      return { success: false, message: error.message };
    }
  };

  const guestLogin = async () => {
    try {
      const response = await signInAnonymously(auth);
      setUser({ ...response.user, username: "Invitado" });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error(
        "Error en el inicio de sesión como invitado: ",
        error.message
      );
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error("Error al cerrar sesión: ", error.message);
      return { success: false, message: error.message };
    }
  };


  const register = async (email, password, profileUrl, username) => {
    try {
      if (!username || !email || !password) {
        throw new Error("Todos los campos son obligatorios");
      }
      
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", response.user.uid);
      await setDoc(userDocRef, {
        email: email,
        profileUrl: profileUrl || "defaultProfileUrl",
        userId: response.user.uid,
        username: username,
        createdAt: new Date().toISOString(),
      });
      
      // Verifica que el documento se haya creado correctamente
      const userData = await updateUserData(response.user.uid);
      setUser({ ...response.user, ...userData });
      setIsAuthenticated(true);
      
      return { success: true, data: response.user };
    } catch (error) {
      console.error("Error en el registro: ", error.message);
      return { success: false, message: error.message };
    }
  };

  
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        guestLogin,
        resetPassword,
        updateUserName, // Añadido
        updateUserPassword, // Añadido
        refreshUserData,
        reauthenticateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }

  return value;
};