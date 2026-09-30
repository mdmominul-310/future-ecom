export type Product = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  status: "In Stock" | "Out of Stock";
  specifications: Record<string, string>;
};
