// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  is_psychologist: boolean;
  description?: string;
  profile_pic?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, userData?: User) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_USER_URL = 'http://127.0.0.1:8000/api/auth/users/me/';

  // Función para obtener datos del usuario
  const fetchUserData = async (authToken: string): Promise<User | null> => {
    try {
      const response = await fetch(API_USER_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        return userData;
      } else if (response.status === 401) {
        // Token inválido o expirado
        console.warn('Token inválido o expirado');
        logout();
        return null;
      } else {
        console.error('Error al obtener datos del usuario:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error de red al obtener datos del usuario:', error);
      return null;
    }
  };

  // Función de login
  const login = async (authToken: string, userData?: User) => {
    try {
      setIsLoading(true);
      
      // Establecer token en el estado
      setToken(authToken);
      
      // Intentar usar localStorage si está disponible, pero no depender de él
      try {
        if (typeof Storage !== 'undefined') {
          localStorage.setItem('authToken', authToken);
          localStorage.setItem('accessToken', authToken);
        }
      } catch (storageError) {
        console.warn('localStorage no disponible, usando solo estado en memoria');
      }

      // Si ya tenemos datos del usuario, usarlos
      if (userData) {
        setUser(userData);
        try {
          if (typeof Storage !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (storageError) {
          console.warn('No se pudieron guardar los datos del usuario en localStorage');
        }
      } else {
        // Si no, obtenerlos del servidor
        const fetchedUserData = await fetchUserData(authToken);
        if (fetchedUserData) {
          setUser(fetchedUserData);
          try {
            if (typeof Storage !== 'undefined') {
              localStorage.setItem('user', JSON.stringify(fetchedUserData));
            }
          } catch (storageError) {
            console.warn('No se pudieron guardar los datos del usuario en localStorage');
          }
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setToken(null);
    
    // Limpiar localStorage si está disponible
    try {
      if (typeof Storage !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    } catch (storageError) {
      console.warn('Error al limpiar localStorage');
    }
    
    // Redirigir al login usando window.location para asegurar limpieza completa
    window.location.href = '/login';
  };

  // Función para refrescar datos del usuario
  const refreshUserData = async () => {
    if (token) {
      const userData = await fetchUserData(token);
      if (userData) {
        setUser(userData);
        try {
          if (typeof Storage !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (storageError) {
          console.warn('No se pudieron actualizar los datos del usuario en localStorage');
        }
      }
    }
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const initAuth = async () => {
      try {
        let storedToken = null;
        let storedUser = null;

        // Intentar recuperar datos de localStorage si está disponible
        try {
          if (typeof Storage !== 'undefined') {
            storedToken = localStorage.getItem('authToken') || localStorage.getItem('accessToken');
            const storedUserData = localStorage.getItem('user');
            if (storedUserData) {
              storedUser = JSON.parse(storedUserData);
            }
          }
        } catch (storageError) {
          console.warn('Error al recuperar datos de localStorage:', storageError);
        }

        if (storedToken) {
          setToken(storedToken);
          
          // Intentar usar datos guardados del usuario si están disponibles
          if (storedUser) {
            setUser(storedUser);
          }

          // Verificar que el token siga siendo válido
          const userData = await fetchUserData(storedToken);
          if (userData) {
            setUser(userData);
            try {
              if (typeof Storage !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(userData));
              }
            } catch (storageError) {
              console.warn('No se pudieron guardar los datos actualizados del usuario');
            }
          } else {
            // Token inválido, limpiar todo
            logout();
          }
        } else {
          // No hay token, asegurar que el estado esté limpio
          setUser(null);
          setToken(null);
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        // En caso de error, limpiar estado
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Efecto para limpiar el estado si se detecta que el usuario no está autenticado
  useEffect(() => {
    if (!isLoading && !token && (window.location.pathname === '/dashboard' || window.location.pathname === '/profile')) {
      window.location.href = '/login';
    }
  }, [isLoading, token]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    logout,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};