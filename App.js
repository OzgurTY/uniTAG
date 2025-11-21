import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Ana Başlık */}
      <Text style={styles.title}>Merhaba UniTAG'lı!</Text>
      {/* Alt Başlık */}
      <Text style={styles.subtitle}>Kampüse güvenli yolculuk başlıyor.</Text>
      {/* Durum çubuğunu (saat, şarj vb.) otomatik ayarla */}
      <StatusBar style="auto" />
    </View>
  );
}

// Stiller (CSS benzeri yapı)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Arka plan rengini hafif gri yaptık (daha modern durur)
    backgroundColor: '#f5f5f5',
    alignItems: 'center', // Yatayda ortala
    justifyContent: 'center', // Dikeyde ortala
  },
  title: {
    fontSize: 32, // Yazı boyutu
    fontWeight: 'bold', // Kalın yazı
    color: '#333', // Koyu gri renk
    marginBottom: 10, // Altındaki öğe ile boşluk
  },
  subtitle: {
    fontSize: 18, // Yazı boyutu
    color: '#666', // Daha açık gri renk
    textAlign: 'center', // Metni ortala
    paddingHorizontal: 20, // Yanlardan boşluk bırak
  },
});