'use client';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import queryString from 'query-string';
import { IconType } from 'react-icons';

interface CategoryProps {
  label: string;
  icon: IconType;
  selected: boolean;
}
const Category: React.FC<CategoryProps> = ({
  label,
  icon: Icon,
  selected,
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const handleClick = useCallback(
    (categoryVal: string) => {
      if (categoryVal === 'all') {
        router.push('/');
      } else {
        let currentQuery = {};
        if (params) {
          currentQuery = queryString.parse(
            params.toString(),
          );
        }
        const updateQuery = {
          ...currentQuery,
          category: categoryVal === 'all' ? '' : label,
        };

        const url = queryString.stringifyUrl(
          {
            url: '/',
            query: updateQuery,
          },
          {
            skipNull: true,
          },
        );
        console.log('url', url);
        router.push(url);
        router.refresh();
      }
    },
    [label, params, router],
  );

  const handleCategoryChange = (newCategory: string) => {
    // const newCategory = e.target.value;

    const seacrhParams = new URLSearchParams(
      params ?? undefined,
    );
    if (newCategory === 'all') {
      seacrhParams.delete('category');
    } else {
      seacrhParams.delete('category');
      seacrhParams.set('category', newCategory);
    }
    if (pathname === '/products') {
      if (newCategory === 'all') {
        router.push('/');
      } else {
        // router.replace(`${pathname}/?${params.toString()}`);
        const currentQuery = queryString.parse(
          seacrhParams.toString(),
        );
        const updateQuery = {
          ...currentQuery,
          category: newCategory,
        };
        const url = queryString.stringifyUrl(
          {
            url: '/products',
            query: updateQuery,
          },
          {
            skipNull: true,
          },
        );

        router.push(url);
      }
    } else {
      router.push(
        `${pathname}products/?${seacrhParams.toString()}`,
      );
    }
  };

  return (
    <div
      onClick={() => handleCategoryChange(label)}
      className={`flex items-center justify-center text-center gap-1 p-2 border-b-2 hover:text-slate-800 transition
    cursor-pointer ${selected ? 'border-b-slate-800 text-slate-800' : 'border-transparent text-slate-500'}`}>
      <Icon size={20} />
      <div className="font-medium text-sm">
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </div>
    </div>
  );
};

export default Category;
