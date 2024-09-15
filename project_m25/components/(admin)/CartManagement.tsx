import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { formatCurrencyUSD } from "@/public";

const CartManagement: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/orders`);
        console.log(response);

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
              <th className="border border-gray-300 p-4">
                Tên người dùng
              </th>{" "}
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
                  {order.receive_name}
                </td>
                <td className="border border-gray-300 p-4">
                  {formatCurrencyUSD(
                    parseFloat(order.total_price.replace(/[^0-9.]/g, ""))
                  )}
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
                          />
                          <span>
                            {item.productName} (x{item.quantity})
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có sản phẩm nào trong các đơn hàng.</p>
      )}
    </div>
  );
};

export default CartManagement;
