import React, { useEffect, useState } from "react";
import { fetchCategories } from "@/services/all.service";

interface Category {
  id: number;
  category_name: string;
  decription: string;
  status: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    getCategories();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách danh mục</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên danh mục</th>
            <th className="px-4 py-2 border">Nội dung</th>
            <th className="px-4 py-2 border">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-4 py-2 border">{category.id}</td>
              <td className="px-4 py-2 border">{category.category_name}</td>
              <td className="px-4 py-2 border">{category.decription}</td>
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
}
