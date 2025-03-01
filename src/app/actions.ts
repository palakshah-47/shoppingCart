'use server';

import { Product } from "./components/products/types";

export const fetchProducts = async (): Promise<Product[] | null> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;
  const res = await fetch(`${apiUrl}/api`, { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};