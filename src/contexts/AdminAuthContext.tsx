
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  isAdminAuthenticated: false,
  adminLogin: () => false,
  adminLogout: () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

// Senha padrão para administração
const ADMIN_PASSWORD = "admin123"; // Esta é apenas uma senha simples para demonstração

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Verificar se o administrador já está autenticado ao carregar
  useEffect(() => {
    const adminAuthStatus = localStorage.getItem('adminAuthenticated');
    if (adminAuthStatus === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminAuthenticated, adminLogin, adminLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

