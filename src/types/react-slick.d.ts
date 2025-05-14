declare module "react-slick" {
  import React from "react";

  interface SliderProps {
    dots?: boolean;
    infinite?: boolean;
    speed?: number;
    slidesToShow?: number;
    slidesToScroll?: number;
    autoplay?: boolean;
    autoplaySpeed?: number;
    arrows?: boolean;
    beforeChange?: (oldIndex: number, newIndex: number) => void;
    className?: string;
    [key: string]: unknown;
  }

  export default class Slider extends React.Component<SliderProps> {
    slickGoTo(slideNumber: number): void;
    slickNext(): void;
    slickPrev(): void;
    slickPause(): void;
    slickPlay(): void;
  }
}
