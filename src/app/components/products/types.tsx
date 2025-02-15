export type Image = {
  color?: string;
  colorCode?: string;
  image: string;
  alt: string;
};
export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  inStock: boolean;
  images: Image[];
  reviews: Review[];
  quantity: number;
  availabilityStatus?: string;
  stock?: number;
};

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdDate?: string;
  date?: string;
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
