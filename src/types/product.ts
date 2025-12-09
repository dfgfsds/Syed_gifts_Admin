import { ProductImage } from './product';

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface Variety {
  color: string;
  sizes: { size: string; stock: number }[];
  image?: ProductImage;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: ProductImage;
  parentId?: string;
  subcategories?: Category[];
}

export interface ProductForm {
  name: string;
  price: number;
  discountedPrice?: number;
  description: string;
  images: ProductImage[];
  varieties: Variety[];
  categoryId?: string;
}

export interface Product extends ProductForm {
  id: string;
  storeId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}