'use client';

import SetColor from '@/app/components/products/SetColor';
import { SetQuantity } from '@/app/components/products/SetQuantity';
import { Rating } from '@mui/material';
import React, {
  useCallback,
  useEffect,
  useState,
  useTransition,
} from 'react';
import { Button } from '@/app/components/ui/Button';
import ProductImage from '@/app/components/products/ProductImage';
import isStringArray from '@/app/utils/isStringArray';
import { attachProductImages } from '@/app/utils/productHelper';
import { useCart } from '@/hooks/useCart';
import { MdCheckCircle, MdArrowBack } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { FullProduct } from '@/app/components/products/types';
import { Image } from '@/app/components/products/types';

export const Horizontal = () => {
  return <hr className="w-[30%]"></hr>;
};

interface ProductDetailsProps {
  product: FullProduct;
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
  stock?: number;
};

export type SelectedImgType = {
  color?: string | null;
  colorCode?: string | null;
  image: string;
  alt: string;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
}) => {
  const { handleAddProductToCart, cartProducts } =
    useCart();
  const [isProductInCart, setIsProductInCart] =
    useState(false);
  const router = useRouter();
  if (isStringArray(product.images)) {
    product = {
      ...product,
      images: attachProductImages(
        product.images,
        product.title,
      ),
    };
  }

  const [cartProduct, setCartProduct] =
    useState<CartProductType>({
      id: product.id,
      name: product.title,
      description: product.description,
      category: product.category,
      brand: product?.brand ?? '',
      price: product.price,
      selectedImg: {
        ...product.images[0],
        color: product.images[0]?.color ?? undefined,
        colorCode:
          product.images[0]?.colorCode ?? undefined,
      },
      quantity: product?.quantity ?? 1,
      stock: product?.stock ?? undefined,
    });

  const productRating =
    product &&
    product.reviews.reduce(
      (total: number, item: any) => total + item.rating,
      0,
    ) / product.reviews.length;

  const handleColorSelect = useCallback(
    (value: SelectedImgType) => {
      setCartProduct((prev) => {
        return { ...prev, selectedImg: value };
      });
    },
    [cartProduct?.selectedImg],
  );

  const handleQtyDecrease = useCallback(() => {
    if (
      !cartProduct?.quantity ||
      cartProduct?.quantity === 1
    )
      return;
    if (cartProduct?.quantity === undefined) {
      setCartProduct({ ...cartProduct, quantity: 0 });
      return;
    }
    setCartProduct((prev) => {
      return {
        ...prev,
        quantity: prev?.quantity ? prev.quantity - 1 : 0,
      };
    });
  }, [cartProduct?.quantity]);

  const handleQtyIncrease = useCallback(() => {
    setCartProduct((prev) => {
      if (
        prev?.quantity === 99 ||
        (product?.inStock && !product?.inStock) ||
        (product?.availabilityStatus &&
          product?.availabilityStatus !== 'In Stock') ||
        (product?.stock && prev?.quantity >= product?.stock)
      )
        return { ...prev };
      return {
        ...prev,
        quantity: (prev?.quantity ?? 0) + 1,
      };
    });
  }, [cartProduct?.quantity]);

  useEffect(() => {
    setIsProductInCart(false);
    if (cartProducts) {
      const existingProduct = cartProducts.find(
        (p) => p.id === product.id,
      );
      if (existingProduct) {
        setIsProductInCart(true);
      }
    }
  }, [cartProducts]);

  let [isPending, startTransition] = useTransition();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="text-slate-500 text-sm">
        <h2 className="text-3xl sm:text-xl font-medium text-slate-700">
          {product?.title}
        </h2>
        <div className="flex items-center gap-2">
          <Rating value={productRating} readOnly />
          <div>{product?.reviews.length} reviews</div>
        </div>
        <div className="text-justify">
          {product?.description}
        </div>
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
            (product?.inStock ??
            product?.availabilityStatus === 'In Stock')
              ? 'text-teal-500'
              : 'text-rose-400'
          }>
          {(product?.inStock ??
          product?.availabilityStatus === 'In Stock')
            ? 'In Stock'
            : 'Out of Stock'}
        </div>
        <Horizontal />
        {isProductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle
                className="text-teal-400"
                size={20}
              />
              <span>Product added to Cart</span>
            </p>
            <div className="max-w-[300px]">
              <Button
                label="View Cart"
                outline
                onClick={() => {
                  router.push('/cart');
                }}></Button>
            </div>
          </>
        ) : (
          <>
            {product?.images.filter((img: any) => img.color)
              ?.length > 0 && (
              <SetColor
                cartProduct={cartProduct}
                images={product?.images?.map(
                  (image: Image) => ({
                    ...image,
                    color: image?.color ?? undefined,
                    colorCode:
                      image?.colorCode ?? undefined,
                  }),
                )}
                handleColorSelect={handleColorSelect}
              />
            )}
            <Horizontal />
            <SetQuantity
              isQtyLabelNeeded={true}
              cartProduct={cartProduct}
              handleQtyDecrease={handleQtyDecrease}
              handleQtyIncrease={handleQtyIncrease}
            />
            <Horizontal />
            {(product?.availabilityStatus &&
              product?.availabilityStatus === 'In Stock') ||
            product?.inStock ? (
              <div className="max-w-[300px]">
                <button
                  className="w-full px-2 h-[30px] mt-4 text-sm font-semibold text-center rounded-md bg-slate-100 text-slate-900"
                  onClick={() => {
                    // Initiating a transition when the button is clicked
                    startTransition(() =>
                      handleAddProductToCart(cartProduct),
                    );
                  }}>
                  {/* Conditional rendering based on the pending state */}
                  {isPending ? (
                    <div className="grid w-full overflow-x-scroll rounded-lg place-items-center lg:overflow-visible">
                      <svg
                        className="text-gray-300 animate-spin"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18">
                        <path
                          d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"></path>
                        <path
                          d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                          stroke="currentColor"
                          strokeWidth="5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-900"></path>
                      </svg>
                    </div>
                  ) : (
                    'Add To Cart'
                  )}
                </button>
              </div>
            ) : null}
          </>
        )}
        <button
          onClick={router.back}
          className="text-slate-500 flex items-center gap-1 mt-2">
          <MdArrowBack />
          <span>Continue Shopping</span>
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
