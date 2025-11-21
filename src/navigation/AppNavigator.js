// src/navigation/AppNavigator.js

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Oluşturduğumuz ekranları içe aktaralım
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    // NavigationContainer, navigasyon ağacının en tepesinde olmalıdır.
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Giriş Ekranı */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }} // Üstteki varsayılan başlık çubuğunu gizle
        />

        {/* Ana Sayfa */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            title: 'Ana Sayfa', // Üstte görünecek başlık
            headerBackVisible: false, // iOS'ta geri butonunu gizle
            headerStyle: { backgroundColor: '#fefbf6' }, // Palet rengimiz
            headerTintColor: '#2c3e50', // Başlık rengi
          }} 
        />
        {/* --------------------------- */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;