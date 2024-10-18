// ProfileScreen.js
import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { useAuth } from "../../context/authContext";
import ProfileStyle from "../../components/profile/ProfileStyle";
import AnonymousProfile from "../../components/anonymous/AnonymousProfile";

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [profileUrl, setProfileUrl] = useState("https://via.placeholder.com/150");

  // Maneja el cierre de sesión
  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Logged out successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View className="flex-1">
      {user && !user.isAnonymous ? (
        <ProfileStyle user={user} profileUrl={profileUrl} setProfileUrl={setProfileUrl} />
      ) : (
        <AnonymousProfile handleLogout={handleLogout} />
      )}
    </View>
  );
};

export default ProfileScreen;
