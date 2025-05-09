import React, { forwardRef } from 'react';

const SkeletonCard = forwardRef<HTMLDivElement>(
  (props, ref) => {
    return [...Array(5)].map((_, index) => (
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 relative animate-pulse"
        key={index}>
        <div
          className="flex flex-col items-center w-[200px] sm:w-20 gap-1 pl-8 sm:pl-0"
          ref={ref}>
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-300 w-full sm:w-20 items-center"></div>
          <p className="mt-2 h-4 w-full rounded-lg bg-gray-600"></p>
          <p className="mt-2 block w-full h-4 rounded-lg bg-gray-600 text-sm font-medium"></p>
          <p className="mt-2 block w-full h-4 rounded-lg bg-gray-600 text-sm font-medium"></p>
        </div>
      </div>
    ));
  },
);
export default SkeletonCard;
