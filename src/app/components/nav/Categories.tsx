'use client';
import React, { useEffect, useState } from 'react';
import Container from '../Container';
import { desiredCategories } from '@/app/utils/productHelper';
import { Category } from '../../utils/productHelper';
import {
  useSearchParams,
  usePathname,
} from 'next/navigation';
import CategoryClient from './CategoryClient';

const Categories = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] =
    useState('all');

  useEffect(() => {
     const query = searchParams?.get('q');
     if (query) {
       const params = new URLSearchParams(searchParams?.toString());
       params.delete('q');
       const current = params.get('category') || 'all';
       setSelectedCategory(current);
     } else {
       const current = searchParams?.get('category') || 'all';
       setSelectedCategory(current);
     }
  }, [searchParams?.toString()]);

  const isMainPage =
    pathname === '/' || pathname === '/products';
  if (!isMainPage) return null;

  return (
    <div>
      <Container>
        <div className="pt-4 flex flex-row items-center justify-between overflow-x-auto">
          {desiredCategories.map((item) => (
            <CategoryClient
              key={item.label}
              label={item.label}
              icon={item.icon}
              selected={selectedCategory === item.label}
            />
          ))}
        </div>
      </Container>
    </div>
  );
};

export default Categories;
