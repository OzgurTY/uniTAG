export type UserRole = 'passenger' | 'driver';

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  university: string; // E-postadan otomatik çekeceğiz (örn: yildiz.edu.tr)
  role: UserRole;
  createdAt: string; // ISO String tarih
  profileImage?: string;
  department?: string; // İleride profil düzenlemeden eklenebilir
  studentIdVerified?: boolean;
}