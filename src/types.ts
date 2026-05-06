export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: 'Smartphones' | 'Laptops' | 'Accessories' | 'Home Appliances' | 'Gadgets';
  images: string[];
  stockStatus: 'In Stock' | 'Few Left' | 'Out of Stock';
  specifications: Record<string, string>;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  flashSaleEndsAt?: string;
  condition: 'Brand New';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  items: { productId: string; quantity: number; price: number; name: string }[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentMethod: 'Pay on Delivery' | 'Online Transfer';
  createdAt: string;
}
