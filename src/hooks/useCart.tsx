import { CartProductType } from '@/app/products/[productId]/ProductDetails';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartProducts: CartProductType[] | null;
  handleAddProductToCart: (
    product: CartProductType,
  ) => void;
  handleRemoveProductFromCart: (
    product: CartProductType,
  ) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handlePaymentIntent: (
    paymentIntent: string | null,
  ) => void;
};

export const CartContext =
  createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}
export const CartContextProvider: React.FC<
  CartProviderProps
> = ({ children }) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartProducts, setCartProducts] = useState<
    CartProductType[] | null
  >(null);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState<
    string | null
  >(null);

  useEffect(() => {
    const storedCartItems: any =
      localStorage.getItem('eShopCartItems') || '[]';
    const cProducts: CartProductType[] | null =
      JSON.parse(storedCartItems);
    const eShopPaymentIntent: any = localStorage.getItem(
      'eShopPaymentIntent',
    );
    const paymentIntent: string | null = JSON.parse(
      eShopPaymentIntent,
    );

    setCartProducts(cProducts);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts.reduce(
          (acc, item) => {
            acc.total +=
              Math.round(item.price) *
              (item?.quantity ?? 1);
            acc.qty += item?.quantity ?? 1;
            return acc;
          },
          { total: 0, qty: 0 },
        );
        setCartTotalAmount(total);
        setCartTotalQty(qty);
      } else {
        setCartTotalAmount(0);
        setCartTotalQty(0);
      }
    };

    getTotals();
  }, [cartProducts]);

  const handleAddProductToCart = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (cartProducts) {
        const existingProduct = cartProducts?.find(
          (p) => p.id === product.id,
        );
        if (existingProduct) {
          updatedCart = cartProducts.map((p) =>
            p.id === product.id
              ? {
                  ...product,
                  quantity: (product?.quantity ?? 0) + 1,
                }
              : p,
          );
        } else {
          updatedCart = [
            ...cartProducts,
            {
              ...product,
              quantity: product?.quantity ?? 1,
            },
          ];
        }
      } else {
        updatedCart = [
          {
            ...product,
            quantity: product?.quantity ?? 1,
          },
        ];
      }
      toast.success('Prodcut added to cart');
      localStorage.setItem(
        'eShopCartItems',
        JSON.stringify(updatedCart),
      );
      setCartProducts(updatedCart);
      // setCartProducts((prev) => {
      //   let updatedCart;
      //   if (prev) {
      //     const existingProduct = prev?.find(
      //       (p) => p.id === product.id,
      //     );
      //     if (existingProduct) {
      //       updatedCart = prev.map((p) =>
      //         p.id === product.id
      //           ? {
      //               ...product,
      //               quantity: product?.quantity ?? 1,
      //             }
      //           : p,
      //       );
      //     } else {
      //       updatedCart = [
      //         ...prev,
      //         {
      //           ...product,
      //           quantity: product?.quantity ?? 1,
      //         },
      //       ];
      //     }
      //   } else {
      //     updatedCart = [
      //       {
      //         ...product,
      //         quantity: product?.quantity ?? 1,
      //       },
      //     ];
      //   }
      //   toast.success('Prodcut added to cart');
      //   localStorage.setItem(
      //     'eShopCartItems',
      //     JSON.stringify(updatedCart),
      //   );
      //   return updatedCart;
      // });
    },
    [cartProducts],
  );

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartProducts) {
        const filteredProducts = cartProducts.filter(
          (prod) => prod.id !== product.id,
        );
        setCartProducts(filteredProducts);
        toast.success('Product removed');
        localStorage.setItem(
          'eShopCartItems',
          JSON.stringify(filteredProducts),
        );
      }
    },
    [cartProducts],
  );

  const handleCartQtyIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;
      if (
        (product?.stock &&
          product?.quantity &&
          product.quantity >= product.stock) ||
        product?.quantity === 99
      ) {
        return toast.error('Ooops! Maximum reached');
      }
      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingProductIndex = updatedCart.findIndex(
          (p) => p.id === product.id,
        );
        if (existingProductIndex > -1) {
          updatedCart[existingProductIndex].quantity =
            (updatedCart[existingProductIndex]?.quantity ??
              1) + 1;
        }
        setCartProducts(updatedCart);
        localStorage.setItem(
          'eShopCartItems',
          JSON.stringify(updatedCart),
        );
      }
    },
    [cartProducts],
  );

  const handleCartQtyDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (!product?.quantity || product?.quantity === 0) {
        return toast.error('Ooops! Minimum reached');
      }
      if (cartProducts) {
        updatedCart = [...cartProducts];
        const existingProductIndex = updatedCart.findIndex(
          (p) => p.id === product.id,
        );
        if (existingProductIndex > -1) {
          updatedCart[existingProductIndex].quantity -= 1;
        }
        setCartProducts(updatedCart);
        localStorage.setItem(
          'eShopCartItems',
          JSON.stringify(updatedCart),
        );
      }
    },
    [cartProducts],
  );

  const handleClearCart = useCallback(() => {
    setCartProducts(null);
    setCartTotalQty(0);
    localStorage.setItem(
      'eShopCartItems',
      JSON.stringify(null),
    );
  }, [cartProducts]);

  const handlePaymentIntent = useCallback(
    (val: string | null) => {
      setPaymentIntent(paymentIntent);
      localStorage.setItem(
        'eShopPaymentIntent',
        JSON.stringify(val),
      );
    },
    [paymentIntent],
  );

  const value: CartContextType = {
    cartTotalQty,
    cartTotalAmount,
    cartProducts: cartProducts,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleCartQtyIncrease,
    handleCartQtyDecrease,
    handleClearCart,
    paymentIntent,
    handlePaymentIntent,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      'useCart must be used within a CartContextProvider',
    );
  }
  return context;
};
