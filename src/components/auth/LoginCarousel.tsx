// /src/components/auth/LoginCarousel.tsx
"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarouselItem {
  id: number;
  teamImage: string;
}

interface LoginCarouselProps {
  items: CarouselItem[];
}

// Colores de fondo para fallback cuando no hay imágenes
const fallbackColors = [
  "linear-gradient(135deg, #4285F4, #0F9D58)", // Azul a verde
  "linear-gradient(135deg, #DB4437, #F4B400)", // Rojo a amarillo
  "linear-gradient(135deg, #5B51D8, #833AB4)", // Morado a violeta
];

const LoginCarousel: React.FC<LoginCarouselProps> = ({ items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageSources, setImageSources] = useState<Record<number, string>>(
    items.reduce((acc, item) => ({ ...acc, [item.id]: item.teamImage }), {})
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    fade: true,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
  };

  // Precargar imágenes silenciosamente
  useEffect(() => {
    items.forEach((item) => {
      const img = new Image();
      img.onload = () => {
        setImageSources((prev) => ({ ...prev, [item.id]: item.teamImage }));
      };
      img.onerror = () => {
        // En caso de error, usar un color de fondo como respaldo
        setImageSources((prev) => ({
          ...prev,
          [item.id]: "none",
        }));
      };
      img.src = item.teamImage;
    });
  }, [items]);

  const goToSlide = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const sliderRef = React.useRef<Slider>(null);

  // Función para obtener estilo de fondo basado en id
  const getSlideStyle = (id: number) => {
    const source = imageSources[id];

    if (source && source !== "none") {
      return {
        backgroundImage: `url("${source}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }

    // Si no hay imagen disponible, usar color de fondo
    return {
      background: fallbackColors[(id - 1) % fallbackColors.length],
    };
  };

  return (
    <div className="w-full h-full relative bg-black">
      {/* Carrusel a pantalla completa */}
      <Slider ref={sliderRef} {...sliderSettings} className="w-full h-full">
        {items.map((item) => (
          <div key={item.id} className="h-full">
            {/* Slide con imagen o color de fondo */}
            <div className="w-full h-full" style={getSlideStyle(item.id)}></div>
          </div>
        ))}
      </Slider>

      {/* Puntos de navegación interactivos en posición absoluta */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-10">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none ${
              idx === currentSlide
                ? "bg-white scale-110"
                : "bg-white bg-opacity-50 hover:bg-opacity-70"
            }`}
            aria-label={`Ir a la diapositiva ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginCarousel;
