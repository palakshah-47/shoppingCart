'use client';

import { useEffect, useRef } from 'react';

type Props = {
  onLoadMore: () => void;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
};

export default function InfiniteScrollTrigger({
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 1.0 }, // trigger when fully visible
    );

    const current = ref.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        bottom: 0,
        height: 0,
        width: 0,
      }}
    />
  );
}
