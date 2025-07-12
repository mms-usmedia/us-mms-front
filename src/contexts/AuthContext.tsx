// /src/contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth";

// Tipo para el usuario
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Verificar estado de autenticación al cargar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // En una implementación real, verificaríamos la validez del token
        // y obtendríamos la información del usuario
        const isAuthenticatedUser = AuthService.isAuthenticated();

        if (isAuthenticatedUser) {
          // Mock: En una implementación real, obtendríamos esta información del backend
          setUser({
            id: "1",
            email: "user@example.com",
            name: "User Name",
            role: "user",
          });
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Función de login
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await AuthService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);

      // Establecer cookie y localStorage
      localStorage.setItem("isLoggedIn", "true");
      document.cookie = "isLoggedIn=true; path=/; max-age=86400";

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de login con Google
  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await AuthService.loginWithGoogle();
      setUser(response.user);
      setIsAuthenticated(true);

      // No necesitamos establecer isLoggedIn ya que lo hace el servicio AuthService

      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función de logout
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      setIsAuthenticated(false);

      // Eliminar tanto de localStorage como de cookies
      localStorage.removeItem("isLoggedIn");
      document.cookie =
        "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Valores del contexto
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
