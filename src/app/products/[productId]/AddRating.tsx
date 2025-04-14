'use client';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/input';
import { Button } from '@/app/components/ui/Button';
import { SafeUser } from '@/types';
import { Rating } from '@mui/material';
import { Order, Product, Review } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

interface AddRatingProps {
  product: Product & {
    reviews: Review[];
  };
  user: (SafeUser & { orders: Order[] }) | null;
}

const AddRating: React.FC<AddRatingProps> = ({
  product,
  user,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      comment: '',
      rating: 0,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const onSubmit: SubmitHandler<FieldValues> = async (
    data: FieldValues,
  ) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
      <Heading title="Rate this product" />
      <Rating
        onChange={(_, newValue) =>
          setCustomValue('rating', newValue)
        }
      />
      <Input id='comment' label='Comment' disabled={isLoading} register={register} errors={errors}
      required/>
      <Button label={isLoading ? 'Loading' : 'Rate Product'} onClick={handleSubmit(onSubmit)}/>
    </div>
  );
};

export default AddRating;
