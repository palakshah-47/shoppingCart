import { useEffect, useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import leftbanner1 from '../../assets/images/leftbanner-1.png';
import leftbanner2 from '../../assets/images/calvinklein-leftbanner-1.png';
import leftbanner3 from '../../assets/images/calvinklein-leftbanner-2.png';
import leftbanner4 from '../../assets/images/calvinklein-leftbanner-3.png';

export const ImageSlideShow = () => {
  const images = [
    { image: leftbanner1, alt: 'A fashion trend, stylish' },
    { image: leftbanner2, alt: 'A style, calvin klein' },
    { image: leftbanner3, alt: 'Another calvin klein style' },
    { image: leftbanner4, alt: 'A unique calvin klein style' },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<number[]>([0]); // Preload first image

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        const nextIndex = prevIndex < images.length - 1 ? prevIndex + 1 : 0;
        // Preload next image, ensuring unique values
        setLoadedImages(prev => Array.from(new Set([...prev, nextIndex])));
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Preload the next image when current changes
  useEffect(() => {
    const nextIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    setLoadedImages(prev => Array.from(new Set([...prev, nextIndex])));
  }, [currentImageIndex, images.length]);

  return (
    <>
      {images.map((image, index) => {
        const isCurrentImage = currentImageIndex === index;
        const shouldLoad = loadedImages.includes(index);
        
        if (!shouldLoad && !isCurrentImage) {
          return null; // Don't render images that aren't loaded yet
        }

        return (
          <Image
            key={`image-${index}`}
            src={image.image}
            alt={image.alt}
            fill
            priority={index === 0} // Only prioritize the first image
            loading={index === 0 ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`${isCurrentImage ? clsx('image-class', 'active', 'main-image') : clsx('image-class', 'main-image')}`}
            onLoad={() => {
              // Mark image as loaded
              setLoadedImages(prev => Array.from(new Set([...prev, index])));
            }}
          />
        );
      })}
    </>
  );
};
