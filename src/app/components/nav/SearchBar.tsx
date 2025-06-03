'use client';

import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useRef } from 'react';
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

const SearchBar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get('searchTerm') as string;

    const searchParams = new URLSearchParams(
      params ?? undefined,
    );
    const category = searchParams.get('category');
    if (category) {
      searchParams.delete('category');
    }
    if (pathname === '/products' && searchTerm) {
      searchParams.set('q', searchTerm);
      router.push(`${pathname}?${searchParams.toString()}`);
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
    } else if (pathname === '/' && searchTerm) {
      searchParams.set('q', searchTerm);
      router.push(
        `${pathname}products?${searchParams.toString()}`,
      );
      // formData.set('searchTerm', '');
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
    } else if (!searchTerm) {
      searchParams.delete('q');
      router.push('/');
      if (searchInputRef.current) {
        searchInputRef.current.value = '';
      }
    }
  };

  const isMainPage =
    pathname === '/' || pathname === '/products';
  if (!isMainPage) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-40 md:w-80 sm:w-40 mx-auto relative">
      <div
        className="flex items-center gap-2 rounded-xl bg-white border-2
      border-black/10 focus-within:border-blue-500/50 transition-all duration-300">
        <div className="flex items-center w-40 md:w-80 sm:w-40 pl-2">
          <input
            type="text"
            ref={searchInputRef}
            name="searchTerm"
            autoComplete="off"
            placeholder="Explore E~shop"
            className="flex-1 px-3 py-2 border-none focus:outline-none
             focus:ring-0 placeholder:text-zinc:400 w-40 md:w-80 sm:w-40"
          />
          <button
            type="submit"
            className="p-2 bg-slate-700 text-white rounded-r-md hover:opacity-80">
            Search
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
