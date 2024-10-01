'use client';

import { Rating } from '@mui/material';
import React from 'react';

interface ProductDetailsProps {
  product: any;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const productRating =
    product.reviews.reduce((total: number, item: any) => total + item.rating, 0) / product.reviews.length;

  const Horizontal = () => {
    return <hr className="w-[30%]"></hr>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>images</div>
      <div className="text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product.name}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <div className="text-justify">{product.description}</div>
        <Horizontal />
        <div>
          <span className="font-semibold">CATEGORY:</span>
          {product.category}
        </div>
        <div>
          <span className="font-semibold">BRAND:</span>
          {product.brand}
        </div>
        <div className={product.inStock ? 'text-teal-500' : 'text-rose-400'}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
