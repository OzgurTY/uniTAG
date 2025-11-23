// src/context/AuthContext.tsx

import { User, onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
});

// Hook: Diğer sayfalardan bu veriye erişmek için kullanacağız
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase dinleyicisi: Kullanıcı giriş/çıkış yaptığında tetiklenir
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // Yükleme bitti, durum belli oldu
    });

    return unsubscribe; // Component ölürse dinlemeyi bırak
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user, // User varsa true, yoksa false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};