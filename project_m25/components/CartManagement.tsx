import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

const CartManagement: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("adminToken");

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/orders?user_id=${userId}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Kiểm tra nếu không có sản phẩm nào trong tất cả các đơn hàng
  const hasProducts = orders.some(
    (order) => order.order_detail && order.order_detail.length > 0
  );

  return (
    <div>
      {hasProducts ? (
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-4">Đơn hàng ID</th>
              <th className="border border-gray-300 p-4">Ngày đặt</th>
              <th className="border border-gray-300 p-4">Tổng giá</th>
              <th className="border border-gray-300 p-4">Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-4">{order.id}</td>
                <td className="border border-gray-300 p-4">
                  {new Date(order.order_at).toLocaleString()}
                </td>
                <td className="border border-gray-300 p-4">
                  ${parseFloat(order.total_price).toFixed(2)}
                </td>
                <td className="border border-gray-300 p-4">
                  {order.order_detail && order.order_detail.length > 0 ? (
                    <ul>
                      {order.order_detail.map((item: any) => (
                        <li key={item.productId} className="flex items-center">
                          <Image
                            src={item.image}
                            alt={item.productName}
                            width={50}
                            height={50}
                          ></Image>
                          <span>
                            {item.productName} (x{item.quantity})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}{" "}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có sản phẩm nào trong các đơn hàng.</p> // Thông báo ở cả trang
      )}
    </div>
  );
};

export default CartManagement;
