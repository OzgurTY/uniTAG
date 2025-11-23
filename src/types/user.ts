export type UserRole = 'passenger' | 'driver';

// Yeni eklenen kısım: Araç detayları
export interface DriverDetails {
  carModel: string;
  carColor: string;
  plateNumber: string;
  verified: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  university: string;
  role: UserRole;
  createdAt: string;
  profileImage?: string;
  department?: string;
  studentIdVerified?: boolean;
  // Opsiyonel olarak sürücü detaylarını ekliyoruz
  driverDetails?: DriverDetails; 
  rating?: number;       // Sürücü Puanı (Örn: 4.8)
  reviewCount?: number;  // Kaç kişi puanladı?
  rideCount?: number;    // Kaç yolculuk tamamladı?
}