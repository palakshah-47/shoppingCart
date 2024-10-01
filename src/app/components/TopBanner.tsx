import Image from 'next/image';
export const TopBanner = () => {
  return (
    <div className="relative mx-auto py-8 flex flex-col md:flex-row sm:flex-col sm:w-[360px]">
      <div className="w-full aspect-video max-w-[718px] relative md:max-w-[547px] h-96">
        <Image src="/mainLeftImage.png" fill alt="left banner" className="main-image" />
      </div>
      <div className="relative w-full flex flex-row">
        <div className="w-full relative aspect-video max-w-[718px] md:max-w-[747px] h-96 sm:min-h-[80]">
          <Image src="/mainRightImage.png" fill alt="right banner" className="main-image" />
        </div>
        <div className="absolute top-1/4 sm:top-4 left-1/2 transform -translate-x-1/2 mb-8 md:mb-0 text-center flex flex-col whitespace-nowrap">
          <h1 className="main-text">SMOCKS, ROBES & WRAPS</h1>
          <p className=" text-gray-800 text-xl md:text-2xl mb-2">Poolside glam included From $4.99</p>
          <p className="text-gray-800 text-xl mb-2">Enjoy discount on Summer Essentials</p>
          <p className="font-bold text-yellow-400 text-xl mb-2">Get 30% OFF</p>
        </div>
      </div>
    </div>
  );
};
