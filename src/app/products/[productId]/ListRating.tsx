'use client';

import Heading from '@/app/components/Heading';
import React from 'react';
import { Review, Product } from '@/app/components/products/types';
import moment from 'moment';
import Rating from '@mui/material/Rating';
import Avatar from '@/app/components/Avatar';

interface ListRatingProps {
  product: Product;
}

const ListRating: React.FC<ListRatingProps> = ({ product }) => {
  return (
    <div>
      <Heading title="Product Review" />
      <div className="text-sm mt-2">
        {product?.reviews?.map((review: Review) => {
          return (
            <div key={review.id} className="max-w-[300px]">
              <div key={review.id} className="flex gap-2 items-center">
                <Avatar src={review?.user?.image} />
                <div className="font-semibold">{review?.user?.name}</div>
                <div className="font-light">{moment(review?.createdDate).fromNow()}</div>
              </div>
              <div key={review.id} className="mt-2">
                <Rating value={review.rating} readOnly></Rating>
                <div className="ml-2">{review.comment}</div>
                <hr className="mt-4 mb-4"></hr>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListRating;
