"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type OrderDetail = {
  productId: string;
  productName: string;
  unitPrice: string;
  quantity: number;
};

type Order = {
  id: string;
  user_id: string;
  order_at: string;
  total_price: string;
  status: boolean;
  order_detail: OrderDetail[];
};

const Cart: React.FC = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = localStorage.getItem("adminToken");

      try {
        const response = await axios.get(
          `http://localhost:8080/orders?user_id=${userId}`
        );
        const existingOrder = response.data[0];

        if (existingOrder) {
          setOrder(existingOrder);
        } else {
          setOrder(null);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        toast.error("Có lỗi xảy ra khi tải giỏ hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQuantityChange = async (productId: string, quantity: number) => {
    if (!order || quantity < 1) return;

    const updatedOrder = { ...order };
    const itemIndex = updatedOrder.order_detail.findIndex(
      (item) => item.productId === productId
    );

    if (itemIndex >= 0) {
      updatedOrder.order_detail[itemIndex].quantity = quantity;

      updatedOrder.total_price = updatedOrder.order_detail
        .reduce(
          (total, item) => total + parseFloat(item.unitPrice) * item.quantity,
          0
        )
        .toFixed(2);

      await updateOrder(updatedOrder);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (!order) return;

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này?"
    );
    if (!confirmDelete) return;

    const updatedOrder = { ...order };
    updatedOrder.order_detail = updatedOrder.order_detail.filter(
      (item) => item.productId !== productId
    );

    updatedOrder.total_price = updatedOrder.order_detail
      .reduce(
        (total, item) => total + parseFloat(item.unitPrice) * item.quantity,
        0
      )
      .toFixed(2);

    await updateOrder(updatedOrder);
  };

  const updateOrder = async (updatedOrder: Order) => {
    try {
      await axios.put(
        `http://localhost:8080/orders/${updatedOrder.id}`,
        updatedOrder
      );
      setOrder(updatedOrder);
      toast.success("Giỏ hàng đã được cập nhật!");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Có lỗi xảy ra khi cập nhật giỏ hàng.");
    }
  };

  const handlePayment = () => {
    if (!order) return;
    setShowPaymentForm(true);
  };

  const handleConfirmPayment = async () => {
    if (!order) return;

    setPaymentLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/payments`, {
        orderId: order.id,
        totalAmount: order.total_price,
        userId: order.user_id,
        success: "Thành công",
      });

      if (response.data.success) {
        await axios.put(`http://localhost:8080/orders/${order.id}`, {
          ...order,
          status: true,
          receive_name: paymentInfo.name,
          receive_address: paymentInfo.address,
          receive_phone: paymentInfo.phone,
        });

        toast.success("Thanh toán thành công!");

        // Đặt order thành null để hiển thị giỏ hàng trống
        setOrder(null);
        setShowPaymentForm(false);
        setTimeout(() => {
          router.push("/user");
        }, 1500);
      } else {
        toast.error("Có lỗi xảy ra trong quá trình thanh toán.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      toast.error("Có lỗi xảy ra trong quá trình thanh toán.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn</h1>
      {order && order.order_detail.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Sản phẩm</th>
              <th className="border border-gray-300 p-2">Giá</th>
              <th className="border border-gray-300 p-2">Số lượng</th>
              <th className="border border-gray-300 p-2">Tổng</th>
              <th className="border border-gray-300 p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {order.order_detail.map((item) => (
              <tr key={item.productId}>
                <td className="border border-gray-300 p-2">
                  {item.productName}
                </td>
                <td className="border border-gray-300 p-2">
                  ${item.unitPrice}
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.productId,
                        parseInt(e.target.value)
                      )
                    }
                    className="w-16 text-center"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>Giỏ hàng của bạn trống.</div>
      )}
      <div className="mt-4">
        <h2 className="text-lg font-bold">
          Tổng tiền: {order ? order.total_price : "0.00"}
        </h2>
      </div>
      <button
        onClick={handlePayment}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        disabled={paymentLoading || !order || order.order_detail.length === 0}
      >
        Thanh toán
      </button>

      {showPaymentForm && (
        <div className="mt-4 p-4 border border-gray-300 rounded">
          <h2 className="text-lg font-bold mb-2">Thông tin thanh toán</h2>
          <div>
            <label className="block mb-1">Tên:</label>
            <input
              type="text"
              value={paymentInfo.name}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, name: e.target.value })
              }
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mt-2">
            <label className="block mb-1">Địa chỉ:</label>
            <input
              type="text"
              value={paymentInfo.address}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, address: e.target.value })
              }
              className="border rounded w-full p-2"
            />
          </div>
          <div className="mt-2">
            <label className="block mb-1">Số điện thoại:</label>
            <input
              type="text"
              value={paymentInfo.phone}
              onChange={(e) =>
                setPaymentInfo({ ...paymentInfo, phone: e.target.value })
              }
              className="border rounded w-full p-2"
            />
          </div>
          <button
            onClick={handleConfirmPayment}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            disabled={paymentLoading}
          >
            {paymentLoading ? "Đang thanh toán..." : "Xác nhận thanh toán"}
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Cart;
