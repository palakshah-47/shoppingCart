export type Image = {
  color: string;
  colorCode: string;
  image: string;
};
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  inStock: boolean;
  images: Image[];
  reviews: Review[];
  quantity: number;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdDate: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean | null;
    image?: string;
    hashedPassword?: string | null;
    createdAt: string;
    updatedAt: string;
    role?: string;
  };
};
