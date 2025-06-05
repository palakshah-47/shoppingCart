'use client';
import Heading from '@/app/components/Heading';
import Input from '@/app/components/inputs/input';
import { Button } from '@/app/components/ui/Button';
import { SafeUser } from '@/types';
import { Rating } from '@mui/material';
import { Order, Product, Review } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FieldValues,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';

interface AddRatingProps {
  product: Product & {
    reviews: Review[];
  };
  user: (SafeUser & { orders: Order[] }) | null;
  existingReview?: Review | null;
}

const AddRating: React.FC<AddRatingProps> = ({
  product,
  user,
  existingReview,
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
    setIsLoading(true);
    if (data.rating === 0) {
      toast.error('Please select a rating');
      setIsLoading(false);
      return;
    }
    const ratingData = {
      ...data,
      userId: user?.id,
      productId: product.id,
    };

    // If no review exists, proceed to create a new one
    try {
      const ratingResponse = await axios.post(
        '/api/rating',
        ratingData,
      );
      if (ratingResponse.status == 201) {
        toast.success('Rating submitted!.');
        router.refresh();
        reset();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error(
            'You have already rated this product.',
          );
        }
      } else {
        toast.error(
          'Failed to submit rating. Please try again later.',
        );
      }
      return;
    } finally {
      setIsLoading(false);
    }
  };

  if (!user || !product) return null;

  const deliveredOrder = user?.orders.some(
    (order) =>
      order.deliveryStatus === 'delivered' &&
      order.products.find(
        (item) => item.id === product.id.toString(),
      ),
  );

  if (existingReview || !deliveredOrder) return null;

  return (
    <div className="flex flex-col gap-2 max-w-[500px]">
      <Heading title="Rate this product" />
      <Rating
        onChange={(_, newValue) =>
          setCustomValue('rating', newValue)
        }
      />
      <Input
        id="comment"
        label="Comment"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isLoading ? 'Loading' : 'Rate Product'}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default AddRating;
