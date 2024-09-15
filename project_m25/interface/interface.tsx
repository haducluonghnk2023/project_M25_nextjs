interface Product {
  id: any;
  image: string;
  product_name: string;
  unit_price: string;
  sizes: string[];
  options: string[];
  stock: string;
  new?: boolean;
  category: string;
}

interface OrderDetail {
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
  image: string;
  customization?: {
    shaft: string;
    tipChange: string;
    weightChange: string;
    buttLength: string;
  };
}

interface Order {
  id: string;
  user_id: string;
  order_at: string;
  total_price: string;
  status: boolean;
  note: string;
  order_detail: OrderDetail[];
  receive_name: string;
  receive_address: string;
  receive_phone: string;
  created_at: string;
  updated_at: string;
}
