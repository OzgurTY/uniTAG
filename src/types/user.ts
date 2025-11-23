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
}