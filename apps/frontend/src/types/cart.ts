export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  price: string;
  stock: number;
  status: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product: CartItemProduct;
}

export interface CartResponse {
  id: string;
  status: string;
  items: CartItem[];
  summary: {
    subtotal: string;
    totalItems: number;
    distinctItems: number;
  };
}
