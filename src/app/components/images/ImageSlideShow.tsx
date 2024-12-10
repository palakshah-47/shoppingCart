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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return images.map((image, index) => (
    <Image
      key={`image-${index}`}
      src={image.image}
      alt={image.alt}
      fill
      priority={true}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`${currentImageIndex === index ? clsx('image-class', 'active', 'main-image') : clsx('image-class', 'main-image')}`}
    />
  ));
};
