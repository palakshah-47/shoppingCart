'use client';

import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

const SearchBar = () => {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { searchTerm: '' },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (
    data: FieldValues,
  ) => {
    const searchParams = new URLSearchParams(
      params ?? undefined,
    );
    const category = searchParams.get('category');
    if (category) {
      searchParams.delete('category');
    }
    if (pathname === '/products' && data.searchTerm) {
      searchParams.set('q', data.searchTerm);
      router.push(`${pathname}?${searchParams.toString()}`);
      reset();
    } else if (pathname === '/' && data.searchTerm) {
      searchParams.set('q', data.searchTerm);
      router.push(
        `${pathname}products?${searchParams.toString()}`,
      );
      reset();
    } else if (!data.searchTerm) {
      searchParams.delete('q');
      router.push('/');
    }
  };

  const isMainPage =
    pathname === '/' || pathname === '/products';
  if (!isMainPage) return null;

  return (
    <div className="flex items-center w-40 md:w-80 sm:w-40">
      <input
        {...register('searchTerm')}
        autoComplete="off"
        type="text"
        placeholder="Explore E~shop"
        className="p-2 border border-gray-300 focus:outline-none focus:border-[0.5px] focus:border-slate-500
    w-40 md:w-80 sm:w-40"></input>
      <button
        className="p-2 bg-slate-700 text-white rounded-r-md hover:opacity-80"
        onClick={handleSubmit(onSubmit)}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
