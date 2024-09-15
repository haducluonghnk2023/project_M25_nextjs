import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { formatCurrencyUSD } from "@/public";
import Image from "next/image";

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

  useEffect(() => {
    // Tải thông tin người nhận từ localStorage
    const savedName = localStorage.getItem("receiveName");
    const savedAddress = localStorage.getItem("receiveAddress");
    const savedPhone = localStorage.getItem("receivePhone");

    if (savedName) setReceiveName(savedName);
    if (savedAddress) setReceiveAddress(savedAddress);
    if (savedPhone) setReceivePhone(savedPhone);
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

    const cleanPrice = selectedProduct.unit_price.replace(/[^0-9.]/g, "");
    const unitPrice = parseFloat(cleanPrice);

    if (isNaN(unitPrice)) {
      toast.error("Giá sản phẩm không hợp lệ.");
      return;
    }

    let orderData: Order = {
      id: Math.ceil(Math.random() * 999999).toString(),
      user_id: userId,
      order_at: new Date().toISOString(),
      total_price: "0.00",
      status: true,
      note: "",
      order_detail: [],
      receive_name: receiveName,
      receive_address: receiveAddress,
      receive_phone: receivePhone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      // Kiểm tra đơn hàng của người dùng
      const response = await axios.get(
        `http://localhost:8080/orders?user_id=${userId}`
      );
      const existingOrder = response.data[0];

      if (existingOrder) {
        // Nếu đơn hàng tồn tại, kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = existingOrder.order_detail.findIndex(
          (item: OrderDetail) => item.productId === selectedProduct.id
        );

        if (existingItemIndex >= 0) {
          // Nếu sản phẩm đã có, tăng số lượng
          existingOrder.order_detail[existingItemIndex].quantity += 1;
          toast.success("Sản phẩm đã được cập nhật trong giỏ hàng!");
        } else {
          // Nếu sản phẩm chưa có, thêm vào giỏ hàng
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

        // Cập nhật tổng giá của đơn hàng
        existingOrder.total_price = existingOrder.order_detail
          .reduce(
            (total: number, item: OrderDetail) =>
              total +
              parseFloat(item.unitPrice.replace(/[^0-9.]/g, "")) *
                item.quantity,
            0
          )
          .toFixed(2);

        existingOrder.total_price = formatCurrencyUSD(
          parseFloat(existingOrder.total_price)
        );

        // Cập nhật đơn hàng
        await axios.put(
          `http://localhost:8080/orders/${existingOrder.id}`,
          existingOrder
        );
      } else {
        // Nếu không có đơn hàng, tạo mới
        const newCartItem: OrderDetail = {
          productId: selectedProduct.id,
          productName: selectedProduct.product_name,
          unitPrice: selectedProduct.unit_price,
          quantity: 1,
          image: selectedProduct.image,
        };
        orderData.order_detail.push(newCartItem);

        orderData.total_price = formatCurrencyUSD(unitPrice);

        // Gửi yêu cầu tạo đơn hàng mới
        await axios.post("http://localhost:8080/orders", orderData);
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      }

      
      localStorage.setItem("receiveName", receiveName);
      localStorage.setItem("receiveAddress", receiveAddress);
      localStorage.setItem("receivePhone", receivePhone);
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
                <Image
                  src={product.image}
                  alt="loi"
                  width={200}
                  height={200}
                ></Image>
                <h3 className="font-bold">{product.product_name}</h3>
                <span>
                  From:{" "}
                  {formatCurrencyUSD(
                    parseFloat(product.unit_price.replace(/[^0-9.]/g, ""))
                  )}
                </span>
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
            <p>
              Giá:{" "}
              {formatCurrencyUSD(
                parseFloat(selectedProduct.unit_price.replace(/[^0-9.]/g, ""))
              )}
            </p>

            <Image
              src={selectedProduct.image}
              alt="loi"
              width={200}
              height={200}
            ></Image>
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
      <Toaster /> {/* Thêm Toaster vào đây */}
    </div>
  );
};

export default MainContent;
