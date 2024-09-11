"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

type Product = {
  id: string;
  image: string;
  product_name: string;
  unit_price: string;
  description: string;
  stock: string;
};

const ProductDetail: React.FC<{ productId: string }> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [receiveName, setReceiveName] = useState<string>("");
  const [receiveAddress, setReceiveAddress] = useState<string>("");
  const [receivePhone, setReceivePhone] = useState<string>("");

  // Lấy thông tin sản phẩm
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/products/${productId}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;

    const userId = localStorage.getItem("adminToken");

    if (!userId) {
      toast.error("Bạn cần đăng nhập để mua hàng.");
      return;
    }

    const orderData = {
      user_id: userId,
      order_at: new Date().toISOString(),
      total_price: product.unit_price,
      status: true,
      order_detail: [
        {
          productId: product.id,
          productName: product.product_name,
          unitPrice: product.unit_price,
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
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm vào giỏ hàng.");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!product) return <div>Không tìm thấy sản phẩm.</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row">
        <img
          src={product.image}
          alt={product.product_name}
          className="w-full md:w-1/2 h-80 object-cover"
        />
        <div className="md:ml-4">
          <h2 className="text-2xl font-bold">{product.product_name}</h2>
          <p className="text-lg font-semibold mt-2">
            Giá: ${product.unit_price}
          </p>
          <p className="mt-4">{product.description}</p>
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
          <button
            onClick={handleAddToCart}
            className="mt-4 bg-yellow-500 text-black py-2 px-4 rounded"
          >
            THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductDetail;
