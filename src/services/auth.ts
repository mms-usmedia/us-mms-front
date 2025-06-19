// /src/services/auth.ts

// Tipos de respuesta para la autenticación
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface RefreshTokenResponse {
  accessToken: string;
}

// Servicio para manejar la autenticación
const AuthService = {
  // Login con email y contraseña
  async login(email: string, password: string): Promise<AuthResponse> {
    // TODO: Integrar con el backend cuando esté disponible
    // Mock para desarrollo
    return new Promise((resolve) => {
      setTimeout(() => {
        // Almacenar en localStorage y cookies para que el middleware pueda detectarlo
        localStorage.setItem("isLoggedIn", "true");

        // Crear una cookie que el middleware pueda leer
        document.cookie = "isLoggedIn=true; path=/; max-age=86400";

        resolve({
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          user: {
            id: "1",
            email,
            name: "User Name",
            role: "user",
          },
        });
      }, 1000);
    });

    /* 
    // Código para integrar con backend
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Authentication failed');
    }

    return await response.json();
    */
  },

  // Login con Google
  async loginWithGoogle(): Promise<AuthResponse> {
    // TODO: Integrar con el backend cuando esté disponible
    // Mock para desarrollo (simular inicio de sesión exitoso)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Almacenar en localStorage y cookies para que el middleware pueda detectarlo
        localStorage.setItem("isLoggedIn", "true");

        // Crear una cookie que el middleware pueda leer
        document.cookie = "isLoggedIn=true; path=/; max-age=86400";

        resolve({
          accessToken: "mock-google-access-token",
          refreshToken: "mock-google-refresh-token",
          user: {
            id: "1",
            email: "usuario@usmedia.com",
            name: "User Name",
            role: "user",
          },
        });
      }, 800);
    });
  },

  // Renovar token de acceso
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    // TODO: Integrar con el backend cuando esté disponible
    // Mock para desarrollo
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: "new-mock-access-token",
        });
      }, 500);
    });

    /* 
    // Código para integrar con backend
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return await response.json();
    */
  },

  // Cerrar sesión
  async logout(): Promise<void> {
    // TODO: Integrar con el backend cuando esté disponible
    // Mock para desarrollo
    localStorage.removeItem("isLoggedIn");

    // Eliminar la cookie estableciendo una fecha de expiración en el pasado
    document.cookie =
      "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    /* 
    // Código para integrar con backend
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    */
  },

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    // TODO: Implementar lógica de verificación real cuando tengamos el backend

    // Verificar en localStorage
    const isLoggedInLocal = localStorage.getItem("isLoggedIn") === "true";

    // Verificar en cookies
    const cookies = document.cookie.split(";");
    const isLoggedInCookie = cookies.some((cookie) =>
      cookie.trim().startsWith("isLoggedIn=true")
    );

    return isLoggedInLocal || isLoggedInCookie;

    /* 
    // Código para integrar con backend - una mejor implementación verificaría
    // la validez del token localmente o haría una llamada a la API
    const token = getAccessToken();
    return !!token;
    */
  },
};

export default AuthService;
