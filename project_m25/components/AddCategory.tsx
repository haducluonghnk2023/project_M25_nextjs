import { addCategory, fetchCategories } from "@/services/all.service";
import React, { useState, useEffect } from "react";

export default function AddCategory() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("active");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const newCategory = {
        category_name: categoryName,
        decription: description,
        status,
      };
      await addCategory(newCategory);

      // Cập nhật danh sách danh mục
      const updatedCategories = await fetchCategories();
      setCategories(updatedCategories);

      setCategoryName("");
      setDescription("");
      setStatus("active");
      setSuccess("Danh mục đã được thêm thành công!");
    } catch (error) {
      setError("Đã xảy ra lỗi khi thêm danh mục.");
      console.error("Lỗi khi thêm mới danh mục:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Thêm danh mục mới</h2>

      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Tên danh mục</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Nội dung</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Trạng thái</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Thêm mới
        </button>
      </form>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
