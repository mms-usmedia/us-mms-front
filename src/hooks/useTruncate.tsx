import { useState, useEffect, useMemo } from "react";

/**
 * Hook personalizado para determinar la longitud máxima de texto basado en el tamaño de pantalla
 * y estado del sidebar.
 *
 * @param baseLength - Longitud base para pantallas grandes (ajustada si se proporciona)
 * @param isSidebarCollapsed - Estado de colapso del sidebar
 * @returns Longitud máxima que se debe usar para truncar texto
 */
export const useTruncate = (
  baseLength: number = 70,
  isSidebarCollapsed: boolean = false
): number => {
  // Estado para rastrear el ancho de la ventana
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  // Efecto para actualizar el ancho de la ventana cuando cambia
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize(); // Llamar inmediatamente para configurar el estado inicial

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  // Calcular la longitud máxima basada en el ancho de la ventana
  const maxLength = useMemo(() => {
    if (typeof window === "undefined") {
      return baseLength; // Valor por defecto para SSR
    }

    // Factor multiplicador basado en el estado del sidebar
    const sidebarFactor = isSidebarCollapsed ? 1.2 : 1;

    // Ajustar en base al tamaño de la pantalla
    if (windowWidth < 640) {
      // sm
      return Math.floor(baseLength * 0.4 * sidebarFactor);
    } else if (windowWidth < 768) {
      // md
      return Math.floor(baseLength * 0.6 * sidebarFactor);
    } else if (windowWidth < 1024) {
      // lg
      return Math.floor(baseLength * 0.7 * sidebarFactor);
    } else if (windowWidth < 1280) {
      // xl
      return Math.floor(baseLength * 0.85 * sidebarFactor);
    } else if (windowWidth < 1536) {
      // 2xl
      return Math.floor(baseLength * sidebarFactor);
    } else {
      // 3xl+
      return Math.floor(baseLength * 1.2 * sidebarFactor);
    }
  }, [windowWidth, baseLength, isSidebarCollapsed]);

  return maxLength;
};

export default useTruncate;
