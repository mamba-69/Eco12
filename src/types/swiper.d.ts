import * as React from "react";
import { SwiperOptions, Swiper as SwiperClass } from "swiper/types";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

declare module "swiper/react" {
  export interface SwiperProps
    extends React.HTMLAttributes<HTMLElement>,
      SwiperOptions {
    modules?: Array<
      typeof Pagination | typeof Navigation | typeof Autoplay | any
    >;
    onSwiper?: (swiper: SwiperClass) => void;
    onSlideChange?: (swiper: SwiperClass) => void;
  }
}

declare module "swiper" {
  export interface Swiper {
    slides: any[];
    params: any;
    activeIndex: number;
    initialized: boolean;
    destroyed: boolean;
    rtl: boolean;
    translateTo: (
      translate: number,
      speed: number,
      runCallbacks?: boolean,
      translateBounds?: boolean,
      internal?: boolean
    ) => void;
    slideTo: (index: number, speed?: number, runCallbacks?: boolean) => void;
    update: () => void;
    on: (event: string, handler: (...args: any[]) => void) => void;
    once: (event: string, handler: (...args: any[]) => void) => void;
    off: (event: string, handler?: (...args: any[]) => void) => void;
    destroy: (deleteInstance?: boolean, cleanStyles?: boolean) => void;
  }
}

declare module "swiper/modules" {
  export const Navigation: any;
  export const Pagination: any;
  export const Scrollbar: any;
  export const Autoplay: any;
  export const EffectFade: any;
  export const EffectCube: any;
  export const EffectFlip: any;
  export const EffectCoverflow: any;
  export const Thumbs: any;
  export const Zoom: any;
  export const Controller: any;
  export const A11y: any;
  export const History: any;
  export const HashNavigation: any;
  export const Keyboard: any;
  export const Mousewheel: any;
  export const Virtual: any;
  export const FreeMode: any;
  export const Grid: any;
  export const Lazy: any;
  export const Parallax: any;
}
