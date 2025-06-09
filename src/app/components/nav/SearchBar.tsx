'use client';

import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AutoCompleteBox } from './AutoCompleteBox';
import { useDebounce } from '@/hooks/useDebounce';

const SearchBar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();

  const initialQuery = params?.get('q')?.toString() || '';

  const [inputValue, setInputValue] =
    useState(initialQuery);
  const debouncedSearchTerm = useDebounce(inputValue, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ _id: string; title: string }>
  >([]);
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSuggestions([]);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/autocomplete?q=${encodeURIComponent(debouncedSearchTerm)}`,
        );
        const data = await response.json();        
        setSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchTerm]);

 
  const handleSubmit = (searchValue: string) => {   
    const searchTerm = searchValue as string;

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
    } else if (pathname === '/' && searchTerm) {
      searchParams.set('q', searchTerm);
      router.push(
        `${pathname}products?${searchParams.toString()}`,
      );
    } else if (!searchTerm) {
      searchParams.delete('q');
      router.push(
        pathname === '/products' ? '/products' : '/',
      );
    }
    if (searchInputRef.current) {
      searchInputRef.current.value = '';
    }
    setShowSuggestions(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.value) {
      setShowSuggestions(false);
      return;
    }
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (inputValue.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSelectSuggestion = (title: string) => {    
    handleSubmit(title);
    setSuggestions([]);
    setInputValue('');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        formRef.current &&
        !formRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener(
      'mousedown',
      handleClickOutside,
    );
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      );
    };
  }, []);

  const isMainPage =
    pathname === '/' || pathname === '/products';
  if (!isMainPage) return null;

  return (
    <form
      ref={formRef}
      // onSubmit={handleSearch}
      className="w-40 md:w-80 sm:w-40 mx-auto relative">
      <div
        className="flex items-center gap-2 rounded-xl bg-white border-2
      border-black/10 focus-within:border-blue-500/50 transition-all duration-300">
        <div className="flex items-center w-40 md:w-80 sm:w-40 pl-2">
          <input
            type="text"
            ref={searchInputRef}
            name="searchTerm"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
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
      <AutoCompleteBox
        suggestions={suggestions}
        isLoading={isLoading}
        onSelect={handleSelectSuggestion}
        visible={showSuggestions}></AutoCompleteBox>
    </form>
  );
};

export default SearchBar;
