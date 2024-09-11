import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

type Product = {
  id: string;
  image: string;
  product_name: string;
  unit_price: string;
  sizes: string[];
  options: string[];
  stock: string;
  new?: boolean;
  category: string;
};

const MainContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Thêm trạng thái cho thông tin nhận hàng
  const [receiveName, setReceiveName] = useState<string>("");
  const [receiveAddress, setReceiveAddress] = useState<string>("");
  const [receivePhone, setReceivePhone] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products");
        const filteredProducts = response.data.filter(
          (prod: Product) =>
            prod.category === "Cơ phá Predator" ||
            prod.category === "Găng tay chơi bi-a"
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
    setSelectedProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
    setReceiveName(""); // Reset thông tin
    setReceiveAddress(""); // Reset thông tin
    setReceivePhone(""); // Reset thông tin
  };

  const handleConfirmAddToCart = async () => {
    if (!selectedProduct) return;

    const userId = localStorage.getItem("adminToken");

    if (!userId) {
      toast.error("Bạn cần đăng nhập để mua hàng.");
      handleCloseForm();
      return;
    }

    const orderData = {
      user_id: userId,
      order_at: new Date().toISOString(),
      total_price: selectedProduct.unit_price,
      status: true,
      order_detail: [
        {
          productId: selectedProduct.id,
          productName: selectedProduct.product_name,
          unitPrice: selectedProduct.unit_price,
          quantity: 1,
        },
      ],
      receive_name: receiveName,
      receive_address: receiveAddress,
      receive_phone: receivePhone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:8080/orders", orderData);
      toast.success("Đã thêm vào giỏ hàng thành công!");
      handleCloseForm();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    }
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
                <span>From: ${product.unit_price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-yellow-500 text-black mt-auto rounded"
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
            <p>Giá: ${selectedProduct.unit_price}</p>
            <img
              src={selectedProduct.image}
              alt={selectedProduct.product_name}
              className="w-full h-40 object-cover mb-4"
            />
            <div className="mt-4">
              <label className="block mb-1">Tên người nhận:</label>
              <input
                type="text"
                value={receiveName}
                onChange={(e) => setReceiveName(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Địa chỉ nhận:</label>
              <input
                type="text"
                value={receiveAddress}
                onChange={(e) => setReceiveAddress(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
            <div className="mt-4">
              <label className="block mb-1">Số điện thoại:</label>
              <input
                type="text"
                value={receivePhone}
                onChange={(e) => setReceivePhone(e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>
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

export default MainContent;
