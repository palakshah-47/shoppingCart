import React from 'react';
import { IconType } from 'react-icons';

interface StatusProps {
  text: string;
  icon: IconType;
  bg: string;
  color: string;
}
const Status: React.FC<StatusProps> = ({
  text,
  icon: Icon,
  bg,
  color,
}) => {
  return (
    <div
      className={`${bg} ${color} rounded p-1 flex items-center gap-1 justify-center mt-2 pb-[0.25rem h-8`}>
      {text} <Icon size={15}></Icon>
    </div>
  );
};

export default Status;
