import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Product = {
  id: any;
  image: string;
  product_name: string;
  unit_price: string; // Để lại là string để dễ xử lý
  sizes: string[];
  options: string[];
  stock: string;
  new?: boolean;
  category: string;
};

type OrderDetail = {
  productId: any;
  productName: string;
  unitPrice: string;
  quantity: number;
  image: string;
};

type Order = {
  id: any;
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
};

const MainContent2: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products");
        const filteredProducts = response.data.filter(
          (prod: Product) => prod.category === "Cơ đánh Predator"
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    const userId = localStorage.getItem("adminToken");

    if (!userId) {
      toast.error("Bạn cần đăng nhập để mua hàng.");
      handleCloseForm();
      return;
    }

    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return;

    const userId = localStorage.getItem("adminToken");

    if (!userId) {
      toast.error("Bạn cần đăng nhập để mua hàng.");
      handleCloseForm();
      return;
    }

    let orderData: Order = {
      id: Math.ceil(Math.random() * 999999).toString(),
      user_id: userId,
      order_at: new Date().toISOString(),
      total_price: "0.00", // Khởi tạo giá tổng
      status: true,
      note: "",
      order_detail: [],
      receive_name: "",
      receive_address: "",
      receive_phone: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await axios.get(
        `http://localhost:8080/orders?user_id=${userId}`
      );
      const existingOrder = response.data[0];

      const unitPrice = parseFloat(selectedProduct.unit_price);

      if (existingOrder) {
        const existingItemIndex = existingOrder.order_detail.findIndex(
          (item: OrderDetail) => item.productId === selectedProduct.id
        );

        if (existingItemIndex >= 0) {
          existingOrder.order_detail[existingItemIndex].quantity += 1;
          toast.success("Sản phẩm đã được cập nhật trong giỏ hàng!");
        } else {
          const newCartItem: OrderDetail = {
            productId: selectedProduct.id,
            productName: selectedProduct.product_name,
            unitPrice: selectedProduct.unit_price,
            quantity: 1,
            image: selectedProduct.image,
          };
          existingOrder.order_detail.push(newCartItem);
          toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        }

        existingOrder.total_price = existingOrder.order_detail
          .reduce(
            (total: number, item: OrderDetail) =>
              total + parseFloat(item.unitPrice) * item.quantity,
            0
          )
          .toFixed(2) // Định dạng giá tổng khi hiển thị
          .replace(".", ","); // Thay đổi dấu chấm thành dấu phẩy cho định dạng Việt Nam

        await axios.put(
          `http://localhost:8080/orders/${existingOrder.id}`,
          existingOrder
        );
      } else {
        const newCartItem: OrderDetail = {
          productId: selectedProduct.id,
          productName: selectedProduct.product_name,
          unitPrice: selectedProduct.unit_price,
          quantity: 1,
          image: selectedProduct.image,
        };
        orderData.order_detail.push(newCartItem);
        orderData.total_price = unitPrice.toFixed(2).replace(".", ","); // Định dạng giá

        await axios.post("http://localhost:8080/orders", orderData);
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Error fetching or updating order:", error);
      toast.error("Có lỗi xảy ra khi xử lý đơn hàng.");
    }

    handleCloseForm();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <main className="flex-grow container mx-auto p-4">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative border rounded-lg overflow-hidden shadow-md p-3 flex flex-col h-full"
              >
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-full h-40 object-cover"
                />
                <h3 className="font-bold">{product.product_name}</h3>
                <span>
                  From: $
                  {parseFloat(product.unit_price).toFixed(2).replace(".", ",")}
                </span>
                <button
                  className="bg-yellow-500 text-black mt-auto rounded"
                  onClick={() => handleAddToCart(product)}
                >
                  THÊM VÀO GIỎ HÀNG
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>Không có sản phẩm nào phù hợp.</div>
        )}
      </main>

      {showForm && selectedProduct && (
        <div className="fixed z-50 inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg relative w-96">
            <h2 className="text-lg font-bold mb-4">Thêm vào giỏ hàng</h2>
            <p>{selectedProduct.product_name}</p>
            <p>
              Giá: $
              {parseFloat(selectedProduct.unit_price)
                .toFixed(2)
                .replace(".", ",")}
            </p>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.product_name}
              className="w-full h-40 object-cover mb-4"
            />
            <div className="flex justify-between mt-4">
              <button
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                onClick={handleCloseForm}
              >
                Hủy
              </button>
              <button
                className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
                onClick={handleConfirmAddToCart}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default MainContent2;
