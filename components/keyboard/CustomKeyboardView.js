import { View, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import React from 'react';

const android = Platform.OS === "android";

export default function CustomKeyboardView({ children }) {
  return (
    <KeyboardAvoidingView
      behavior={android ? 'height' : 'padding'} // Comportamiento para Android
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"  // Dismiss al arrastrar
        keyboardShouldPersistTaps="handled" // Manejo de toques mientras el teclado está visible
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
