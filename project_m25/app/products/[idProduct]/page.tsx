"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import { formatCurrencyUSD } from "@/public";
import Image from "next/image";

const ProductDetail: React.FC = () => {
  const { idProduct } = useParams();
  const router = useRouter(); // Khởi tạo router
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (idProduct) {
        try {
          const response = await axios.get(
            `http://localhost:8080/products/${idProduct}`
          );
          setProduct(response.data);
        } catch (error) {
          console.error("Error fetching product:", error);
          toast.error("Có lỗi xảy ra khi lấy thông tin sản phẩm.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [idProduct]);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("adminToken");

    if (!userId) {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng.");
      return;
    }

    if (!product) return;

    const cleanPrice = product.unit_price.replace(/[^0-9.]/g, "");
    const unitPrice = parseFloat(cleanPrice);

    if (isNaN(unitPrice)) {
      toast.error("Giá sản phẩm không hợp lệ.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/orders?user_id=${userId}`
      );
      const existingOrders = response.data;

      const orderToUpdate = existingOrders.find(
        (order: any) => order.user_id === userId
      );

      if (orderToUpdate) {
        const productInCart = orderToUpdate.order_detail.find(
          (item: any) => item.productId === product.id
        );

        if (productInCart) {
          productInCart.quantity += 1;
          await axios.put(
            `http://localhost:8080/orders/${orderToUpdate.id}`,
            orderToUpdate
          );
          toast.success("Sản phẩm đã được cập nhật trong giỏ hàng!");
        } else {
          orderToUpdate.order_detail.push({
            productId: product.id,
            productName: product.product_name,
            unitPrice: product.unit_price,
            quantity: 1,
            image: product.image,
          });
          await axios.put(
            `http://localhost:8080/orders/${orderToUpdate.id}`,
            orderToUpdate
          );
          toast.success("Đã thêm sản phẩm vào giỏ hàng!");
        }
      } else {
        const newOrderData = {
          id: Math.ceil(Math.random() * 999999).toString(),
          user_id: userId,
          order_at: new Date().toISOString(),
          total_price: unitPrice.toFixed(2),
          status: true,
          note: "",
          order_detail: [
            {
              productId: product.id,
              productName: product.product_name,
              unitPrice: product.unit_price,
              quantity: 1,
              image: product.image,
            },
          ],
          receive_name: "",
          receive_address: "",
          receive_phone: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        await axios.post("http://localhost:8080/orders", newOrderData);
        toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Sản phẩm không tồn tại.</div>;

  return (
    <div className="container mx-auto p-4">
      <button
        className="mb-4 bg-gray-300 text-black py-2 px-4 rounded"
        onClick={() => router.back()} // Nút quay lại
      >
        Quay lại
      </button>
      <div className="flex flex-col md:flex-row">
        {/* Hình ảnh chính */}
        <div className="flex-1">
          <Image
            src={product.image}
            alt={product.product_name}
            width={400}
            height={400}
            className="rounded-lg"
          />
          <div className="flex mt-4 overflow-x-auto">
            {product.additional_images?.map((img: string, index: number) => (
              <Image
                key={index}
                src={img}
                alt={`${product.product_name} ${index + 1}`}
                width={200}
                height={200}
                className="rounded-lg mr-2 cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1 pl-6">
          <h1 className="text-3xl font-bold">{product.product_name}</h1>
          <p className="mt-2 text-xl font-semibold">
            Giá :
            {formatCurrencyUSD(
              parseFloat(product.unit_price.replace(/[^0-9.]/g, ""))
            )}
          </p>
          <p className="mt-4 text-gray-700">{product.decription}</p>

          <div className="mt-4">
            <button
              className="bg-yellow-500 text-black py-2 px-4 rounded"
              onClick={handleAddToCart}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default ProductDetail;
