export interface Ride {
  id?: string;
  driverId: string;
  driverName: string;
  driverCarModel: string;
  driverPlate: string;
  origin: string;      // Kalkış Yeri
  destination: string; // Varış Yeri
  departureTime: string; // ISO Tarih Formatı
  price: number;
  totalSeats: number;
  availableSeats: number;
  passengers: string[]; // Yolcuların UID listesi
  status: 'active' | 'full' | 'completed' | 'cancelled';
  createdAt: string;
}