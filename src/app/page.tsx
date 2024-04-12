import mainLeftImage from './assets/images/mainLeftImage.png';
import mainRightImage from './assets/images/mainRightImage.png';

export default function Home() {
  return (
    <div>
      <div className="grid-cols-2 flex flex-row flex-grow">
        <div className="col-span-1">
          <img
            className="hidden md:flex md:flex-col justify-center align-middle self-stretch p-0 w-auto h-fit"
            src={mainLeftImage.src}
            alt="leftImage"
          />
        </div>
        <div className="col-span-1">
          <img
            className="flex flex-col justify-center align-middle p-0"
            src={mainRightImage.src}
            alt="leftImage"
          />
        </div>
      </div>
    </div>
  );
}
