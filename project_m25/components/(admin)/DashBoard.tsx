import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatCurrencyUSD } from "@/public";
import Image from "next/image";

const Dashboard: React.FC = () => {
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalProductsSold, setTotalProductsSold] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [topSellingProduct, setTopSellingProduct] = useState<Product | null>(
    null
  );

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersResponse = await axios.get("http://localhost:8080/orders");
        const productsResponse = await axios.get(
          "http://localhost:8080/products"
        );

        const orders = ordersResponse.data;
        setTotalOrders(orders.length);

        let totalSold = 0;
        let revenue = 0;
        const productSales: { [key: string]: number } = {};

        orders.forEach((order: Order) => {
          order.order_detail.forEach((item: OrderDetail) => {
            totalSold += item.quantity;
            revenue +=
              parseFloat(item.unitPrice.replace(/[^0-9.]/g, "")) *
              item.quantity;

            if (productSales[item.productId]) {
              productSales[item.productId] += item.quantity;
            } else {
              productSales[item.productId] = item.quantity;
            }
          });
        });

        setTotalProductsSold(totalSold);
        setTotalRevenue(revenue);

        const topProductId = Object.keys(productSales).reduce((a, b) =>
          productSales[a] > productSales[b] ? a : b
        );
        const topProduct = productsResponse.data.find(
          (product: Product) => product.id === topProductId
        );
        setTopSellingProduct(topProduct || null);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold">Tổng số đơn hàng</h2>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold">Tổng sản phẩm đã bán</h2>
          <p className="text-2xl font-bold">{totalProductsSold}</p>
        </div>
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold">Tổng doanh thu</h2>
          <p className="text-2xl font-bold">
            {formatCurrencyUSD(totalRevenue)}
          </p>
        </div>
        <div className="bg-white border rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold">Sản phẩm bán chạy nhất</h2>
          {topSellingProduct ? (
            <div>
              <Image
                src={topSellingProduct.image}
                alt="loi"
                width={100}
                height={100}
              ></Image>
              <p className="font-semibold">{topSellingProduct.product_name}</p>
              <p>
                {formatCurrencyUSD(
                  parseFloat(
                    topSellingProduct.unit_price.replace(/[^0-9.]/g, "")
                  )
                )}{" "}
                VNĐ
              </p>
            </div>
          ) : (
            <p>Chưa có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
