export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id?: string;
  name: string;

  slug?: string;

  price?: number;
  salePrice?: number;
  description?: string;
  images: { url: string; public_id: string }[];
  additionalImages?: string[];
  category: Category;
  subcategory?: Subcategory;
  rating?: number;
  status?: string;
  featured?: boolean;
  discount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
}
