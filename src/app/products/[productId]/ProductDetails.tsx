'use client';

import SetColor from '@/app/components/products/SetColor';
import { SetQuantity } from '@/app/components/products/SetQuantity';
import { Rating } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { Button } from '@/app/components/Button';
import ProductImage from '@/app/components/products/ProductImage';
import { Product } from '@/app/components/products/types';
import isStringArray from '@/app/utils/isStringArray';
import { attachProductImages } from '@/app/utils/productHelper';
import { useCart } from '@/hooks/useCart';

export const Horizontal = () => {
  return <hr className="w-[30%]"></hr>;
};

interface ProductDetailsProps {
  product: Product;
}

export type CartProductType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  selectedImg: SelectedImgType;
  quantity: number;
};

export type SelectedImgType = {
  color?: string;
  colorCode?: string;
  image: string;
  alt: string;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  if (isStringArray(product.images)) {
    product = { ...product, images: attachProductImages(product.images, product.title) };
  }
  const { cartTotalQty } = useCart();
  console.log(cartTotalQty);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.title,
    description: product.description,
    category: product.category,
    brand: product.brand,
    price: product.price,
    selectedImg: { ...product.images[0] },
    quantity: product.quantity,
  });

  const productRating =
    product && product.reviews.reduce((total: number, item: any) => total + item.rating, 0) / product.reviews.length;

  const handleColorSelect = useCallback(
    (value: SelectedImgType) => {
      setCartProduct((prev) => {
        return { ...prev, selectedImg: value };
      });
    },
    [cartProduct?.selectedImg],
  );

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct?.quantity === 1) return;
    if (cartProduct?.quantity === undefined) {
      setCartProduct({ ...cartProduct, quantity: 0 });
      return;
    }
    setCartProduct((prev) => {
      return { ...prev, quantity: prev?.quantity ? prev.quantity - 1 : 0 };
    });
  }, [cartProduct?.quantity]);

  const handleQtyIncrease = () => {
    setCartProduct((prev) => {
      if (
        prev?.quantity === 99 ||
        (product?.inStock && !product?.inStock) ||
        (product?.availabilityStatus && product?.availabilityStatus !== 'In Stock') ||
        (product?.stock && prev?.quantity >= product?.stock)
      )
        return { ...prev };
      return { ...prev, quantity: prev?.quantity ? ++prev.quantity : 2 };
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage cartProduct={cartProduct} product={product} handleColorSelect={handleColorSelect} />
      <div className="text-slate-500 text-sm">
        <h2 className="text-3xl font-medium text-slate-700">{product?.title}</h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{product?.reviews.length} reviews</div>
        </div>
        <div className="text-justify">{product?.description}</div>
        <Horizontal />
        <div className="pb-2">
          <span className="font-semibold">CATEGORY: </span>
          {product?.category}
        </div>
        <div className="pb-2">
          <span className="font-semibold">BRAND: </span>
          {product?.brand}
        </div>
        <div
          className={
            (product?.inStock ?? product?.availabilityStatus === 'In Stock') ? 'text-teal-500' : 'text-rose-400'
          }>
          {(product?.inStock ?? product?.availabilityStatus === 'In Stock') ? 'In Stock' : 'Out of Stock'}
        </div>
        <Horizontal />
        {product?.images.filter((img) => img.color)?.length > 0 && (
          <SetColor cartProduct={cartProduct} images={product?.images} handleColorSelect={handleColorSelect} />
        )}
        {/* <Horizontal /> */}
        <SetQuantity
          isQtyLabelNeeded={true}
          cartProduct={cartProduct}
          handleQtyDecrease={handleQtyDecrease}
          handleQtyIncrease={handleQtyIncrease}
        />
        <Horizontal />
        <div className="max-w-[300px]">
          <Button label="Add to Cart" onClick={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
