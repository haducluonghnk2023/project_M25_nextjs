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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products");
        // Lọc sản phẩm có category là "cơ phá predator"
        const filteredProducts = response.data.filter(
          (prod: Product) =>
            prod.category === "Cơ phá Predator" ||
            prod.category === "Găng tay chơi bi-a"
        );
        // console.log(response.data);

        setProducts(filteredProducts);
      } catch (error) {
        console.error("loi lay data san pham:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (product: Product) => {
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
      receive_name: "",
      receive_address: "",
      receive_phone: "",
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
    </div>
  );
};

export default MainContent;
