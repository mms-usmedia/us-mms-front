// /src/app/login/page.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginCarousel from "@/components/auth/LoginCarousel";

// Datos del carrusel
const carouselItems = [
  {
    id: 1,
    title: "Gestión de Campañas Unificada",
    description:
      "Administra tus campañas publicitarias en línea, fuera de línea, broadcast y out-of-home desde una única plataforma centralizada.",
    image: "/carousel/slide1.png",
  },
  {
    id: 2,
    title: "Reportería en Tiempo Real",
    description:
      "Accede a métricas detalladas y reportes de desempeño para optimizar tus campañas y maximizar tu ROI.",
    image: "/carousel/slide2.png",
  },
  {
    id: 3,
    title: "Flujo de Trabajo Simplificado",
    description:
      "Optimiza la colaboración entre vendedores y traffikers con un proceso de aprobación de campañas simplificado.",
    image: "/carousel/slide3.png",
  },
];

export default function LoginPage() {
  const { loginWithGoogle, isLoading: authLoading } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // La redirección se maneja por el flujo OAuth
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo iniciar sesión con Google. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Lado izquierdo - Carrusel */}
      <div className="hidden md:block md:w-1/2 bg-blue-600 text-white overflow-hidden">
        <LoginCarousel items={carouselItems} />
      </div>

      {/* Lado derecho - Inicio de sesión con Google */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md p-8 flex flex-col items-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
            ¡Bienvenido a US Media!
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Inicia sesión con tu cuenta de Google corporativa para acceder al
            panel de control MMS
          </p>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm w-full">
              {error}
            </div>
          )}

          <div className="w-full mb-8">
            <div className="flex items-center justify-center">
              <div className="w-12 border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">
                Iniciar sesión con Google
              </span>
              <div className="w-12 border-t border-gray-300"></div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out mb-4"
            disabled={isLoading || authLoading}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z"
                fill="#4285F4"
              />
              <path
                d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50237 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z"
                fill="#34A853"
              />
              <path
                d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z"
                fill="#FBBC05"
              />
              <path
                d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50237 3.85336 10.1993 3.85336Z"
                fill="#EB4335"
              />
            </svg>
            {isLoading || authLoading
              ? "Iniciando sesión..."
              : "Iniciar sesión con Google"}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Solo los usuarios con cuenta corporativa de US Media pueden
              acceder a esta plataforma
            </p>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} US Media - MMS 2.0</p>
            <p className="mt-1">Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
