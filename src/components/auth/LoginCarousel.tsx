// /src/components/auth/LoginCarousel.tsx
"use client";

import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image?: string;
}

interface LoginCarouselProps {
  items: CarouselItem[];
}

const LoginCarousel: React.FC<LoginCarouselProps> = ({ items }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
  };

  const goToSlide = (index: number) => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const sliderRef = React.useRef<Slider>(null);

  return (
    <div className="w-full h-full bg-blue-600 text-white overflow-hidden flex flex-col">
      <div className="flex-grow flex items-center justify-center py-8">
        <Slider
          ref={sliderRef}
          {...sliderSettings}
          className="w-full max-w-3xl"
        >
          {items.map((item) => (
            <div key={item.id} className="outline-none px-4">
              <div className="flex flex-col items-center text-center relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-10 w-4 h-4 bg-yellow-300 rounded-full opacity-70"></div>
                <div className="absolute top-10 right-10 w-3 h-3 bg-green-300 rounded-full opacity-70"></div>
                <div className="absolute -bottom-10 left-10 w-5 h-5 bg-red-300 rounded-full opacity-70"></div>
                <div className="absolute -bottom-20 right-20 w-4 h-4 bg-purple-300 rounded-full opacity-70"></div>

                {/* Feature card mockups */}
                <div className="relative w-full h-72 mb-8 mt-4">
                  {/* Campaign Management Card */}
                  <div className="w-64 bg-white rounded-xl shadow-lg transform -rotate-6 absolute left-0 top-0 z-10">
                    <div className="px-4 py-3 bg-blue-100 rounded-t-xl">
                      <div className="text-xs text-gray-500 uppercase">
                        CAMPAÑA
                      </div>
                      <div className="text-sm font-bold text-gray-800">
                        Gestión de Campañas Publicitarias
                      </div>
                    </div>
                    <div className="p-4">
                      <ul className="text-left">
                        <li className="flex justify-between text-sm py-1">
                          <span className="text-gray-600">
                            1. Creación de campaña
                          </span>
                          <span className="text-blue-500 text-xs">Fácil</span>
                        </li>
                        <li className="flex justify-between text-sm py-1">
                          <span className="text-gray-600">
                            2. Gestión de unidades
                          </span>
                          <span className="text-blue-500 text-xs">
                            Completo
                          </span>
                        </li>
                        <li className="flex justify-between text-sm py-1">
                          <span className="text-gray-600">
                            3. Generación de PIO
                          </span>
                          <span className="text-blue-500 text-xs">
                            Automático
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Ad Channels Card */}
                  <div className="w-48 bg-white rounded-xl shadow-lg absolute right-0 bottom-0 z-20">
                    <div className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                          <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                        </div>
                        <div className="text-sm font-medium text-gray-800">
                          Canales AD
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Online · Mobile · Display
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                            <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            Broadcast
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          TV · Radio · Streaming
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-2">
                            <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                          </div>
                          <div className="text-sm font-medium text-gray-800">
                            Out of Home
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Billboards · Signage
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reports Card */}
                  <div className="w-40 bg-white bg-opacity-90 rounded-xl shadow-lg transform rotate-3 absolute left-10 bottom-4 z-30">
                    <div className="p-3 flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-xs font-medium text-gray-800">
                        Reportería Avanzada
                      </div>
                    </div>
                    <div className="px-3 pb-3">
                      <div className="text-xs text-gray-500">
                        Métricas en tiempo real
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
                <p className="text-white text-opacity-80 mb-6 px-4 max-w-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Puntos de navegación interactivos */}
      <div className="flex justify-center space-x-3 pb-6">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`w-4 h-4 rounded-full transition-all duration-300 focus:outline-none ${
              idx === currentSlide
                ? "bg-white scale-110"
                : "bg-white bg-opacity-40 hover:bg-opacity-60"
            }`}
            aria-label={`Ir a la diapositiva ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LoginCarousel;
