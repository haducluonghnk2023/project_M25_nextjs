import { fetchProduct } from "@/services/all.service";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Product {
  id: number;
  product_name: string;
  decription: string;
  status: string;
  category: string;
  unit_price: number;
  date: string;
  image: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productsData = await fetchProduct();
        setProducts(productsData);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    getProduct();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>

      <div className="mb-4"></div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên sản phẩm</th>
            <th className="px-4 py-2 border">Hình ảnh</th>
            <th className="px-4 py-2 border">Mô tả</th>
            <th className="px-4 py-2 border">Danh mục</th>
            <th className="px-4 py-2 border">Giá</th>
            <th className="px-4 py-2 border">Ngày</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-2 border">{product.id}</td>
              <td className="px-4 py-2 border">{product.product_name}</td>
              <td className="px-4 py-2 border">
                <Image
                  src={product.image}
                  alt="Hình ảnh sản phẩm"
                  width={50}
                  height={50}
                />
              </td>
              <td className="px-4 py-2 border">{product.decription}</td>
              <td className="px-4 py-2 border">{product.category}</td>
              <td className="px-4 py-2 border">{product.unit_price}$</td>
              <td className="px-4 py-2 border">{product.date}</td>
              <td className="px-4 py-2 border flex justify-evenly">
                <button className="w-[60px] h-[30px] bg-green-500 text-white rounded">
                  Sửa
                </button>
                <button className="w-[60px] h-[30px] bg-red-600 text-white rounded">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
