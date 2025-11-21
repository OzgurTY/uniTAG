// App.js

import React from 'react';
import { StatusBar } from 'expo-status-bar';
// Navigasyon dosyamızı içe aktarıyoruz
// Eğer App.js ana dizindeyse yol: './src/navigation/AppNavigator'
// Eğer App.js src içindeyse yol: './navigation/AppNavigator'
// Aşağıdaki yol, App.js'in ana dizinde olduğu varsayımıyla yazılmıştır.
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      {/* Navigasyon yapısını uygulamaya dahil ediyoruz */}
      <AppNavigator />
      {/* Durum çubuğu (saat, şarj vb.) */}
      <StatusBar style="auto" />
    </>
  );
}