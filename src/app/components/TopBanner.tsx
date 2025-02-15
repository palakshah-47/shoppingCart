'use client';
import Image from 'next/image';
import { ImageSlideShow } from './images/ImageSlideShow';
export const TopBanner = () => {
  return (
    <div className="relative py-4 pr-2 flex flex-col md:flex-row sm:flex-col sm:w-[360px] md:w-[80%]">
      <div className="w-full md:w-[60%] aspect-video max-w-[718px] relative h-96">
        <ImageSlideShow />
      </div>
      <div className="relative w-full md:w-[70%] flex flex-row">
        <div className="w-full relative aspect-video max-w-[718px] h-96 sm:h-[15rem] lg:max-w-[818px]">
          <Image
            src="/mainRightImage.png"
            fill
            alt="right banner"
            className="main-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={true}
          />
        </div>
        <div className="absolute top-1/4 md:top-1/4 sm:top-4 left-1/2 md:left-1/2 transform -translate-x-1/2 mb-8 md:mb-0 text-center flex flex-col whitespace-nowrap">
          <h1 className="main-text">SMOCKS, ROBES & WRAPS</h1>
          <p className=" text-gray-800 text-xl md:text-[1.4rem] mb-2">Poolside glam included From $4.99</p>
          <p className="text-gray-800 text-xl mb-2">Enjoy discount on Summer Essentials</p>
          <p className="font-bold text-yellow-400 text-xl mb-2">Get 30% OFF</p>
        </div>
      </div>
    </div>
  );
};
