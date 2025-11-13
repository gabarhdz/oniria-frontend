// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import type { AxiosInstance } from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  is_psychologist: boolean;
  is_superuser: boolean; // 👈 AGREGADO
  description?: string;
  profile_pic?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData?: User) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

// Crear instancia de axios para autenticación
export const authApiClient: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Interceptor para agregar token automáticamente
authApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas y errores de autenticación
authApiClient.interceptors.response.use( 
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener datos del usuario desde el servidor
  const fetchUserData = async (token: string): Promise<User | null> => {
    try {
      // Usar el endpoint 'me' para obtener datos del usuario actual
      const response = await authApiClient.get('/users/me/');
      
      if (response.status === 200 && response.data) {
        const userData: User = {
          id: response.data.id,
          username: response.data.username,
          email: response.data.email,
          is_psychologist: response.data.is_psychologist || false,
          is_superuser: response.data.is_superuser || false, // 👈 AGREGADO
          description: response.data.description || '',
          profile_pic: response.data.profile_pic || null,
        };
        
        console.log('User data fetched:', userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token inválido, limpiar datos
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        throw new Error('Token inválido');
      }
      
      throw error;
    }
  };

  // Función de login
  const login = async (token: string, userData?: User): Promise<void> => {
    try {
      // Guardar token
      localStorage.setItem('access_token', token);
      
      let finalUserData = userData;
      
      // Si no se proporcionaron datos del usuario, obtenerlos del servidor
      if (!finalUserData) {
        const fetchedUserData = await fetchUserData(token);
        finalUserData = fetchedUserData === null ? undefined : fetchedUserData;
      }
      
      if (finalUserData) {
        setUser(finalUserData);
        localStorage.setItem('user_data', JSON.stringify(finalUserData));
        console.log('User logged in successfully:', finalUserData);
      } else {
        throw new Error('No se pudieron obtener los datos del usuario');
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Limpiar datos en caso de error
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
      setUser(null);
      throw error;
    }
  };

  // Función de logout
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    console.log('User logged out');
  };

  // Función para refrescar datos del usuario
  const refreshUserData = async (): Promise<void> => {
    const token = localStorage.getItem('access_token');
    if (!token || !user) {
      return;
    }

    try {
      const updatedUserData = await fetchUserData(token);
      if (updatedUserData) {
        setUser(updatedUserData);
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        console.log('User data refreshed:', updatedUserData);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      // En caso de error de autenticación, hacer logout
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
    }
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      
      try {
        const token = localStorage.getItem('access_token');
        const storedUserData = localStorage.getItem('user_data');
        
        if (token && storedUserData) {
          try {
            const parsedUserData: User = JSON.parse(storedUserData);
            
            // Verificar que el token sigue siendo válido obteniendo datos frescos
            const freshUserData = await fetchUserData(token);
            
            if (freshUserData) {
              setUser(freshUserData);
              // Actualizar datos almacenados si hay cambios
              localStorage.setItem('user_data', JSON.stringify(freshUserData));
            } else {
              // Si no se pueden obtener datos frescos, usar los almacenados
              setUser(parsedUserData);
            }
          } catch (parseError) {
            console.error('Error parsing stored user data:', parseError);
            logout();
          }
        } else {
          // No hay token o datos de usuario
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;