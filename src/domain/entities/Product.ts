export type Product = {
  id: number;
  name: string;
  price: string;
  shortDescription: string;
  description: string;
  categoryId: number;
  imageUrl: string;
  category: { id: number; tag: string };
};
