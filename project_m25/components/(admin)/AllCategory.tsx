import React, { useEffect, useState } from "react";
import {
  fetchCategories,
  updateCategory,
  deleteCategory,
} from "../../services/all.service";

interface Category {
  id: number;
  category_name: string;
  decription: string;
  status: string;
}

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editCategoryData, setEditCategoryData] = useState<Category | null>(
    null
  );

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

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa danh mục này?");
    if (confirmDelete) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter((category) => category.id !== id));
      } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
      }
    }
  };

  const handleEdit = (category: Category) => {
    setIsEditing(category.id);
    setEditCategoryData(category);
  };

  const handleSaveEdit = async () => {
    if (editCategoryData) {
      try {
        await updateCategory(editCategoryData.id, editCategoryData);
        setCategories(
          categories.map((category) =>
            category.id === editCategoryData.id ? editCategoryData : category
          )
        );
        setIsEditing(null);
        setEditCategoryData(null);
      } catch (error) {
        console.error("Lỗi khi sửa danh mục:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách danh mục</h2>
      <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
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
              <td className="px-4 py-2 border">
                {isEditing === category.id ? (
                  <input
                    type="text"
                    value={editCategoryData?.category_name || ""}
                    onChange={(e) =>
                      setEditCategoryData({
                        ...editCategoryData,
                        category_name: e.target.value,
                      } as Category)
                    }
                  />
                ) : (
                  category.category_name
                )}
              </td>
              <td className="px-4 py-2 border">{category.decription}</td>
              <td className="px-4 py-2 border">
                {isEditing === category.id ? (
                  <button
                    className="bg-blue-500 text-white rounded"
                    onClick={handleSaveEdit}
                  >
                    Lưu
                  </button>
                ) : (
                  <div className="flex justify-evenly">
                    <button
                      className="w-[60px] h-[30px] bg-green-500 text-white rounded"
                      onClick={() => handleEdit(category)}
                    >
                      Sửa
                    </button>
                    <button
                      className="w-[60px] h-[30px] bg-red-600 text-white rounded"
                      onClick={() => handleDelete(category.id)}
                    >
                      Xóa
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form sửa danh mục */}
      {isEditing !== null && editCategoryData && (
        <div className="border border-gray-300 p-4 rounded">
          <h3 className="text-xl font-bold mb-2">Chỉnh sửa danh mục</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
            }}
          >
            <div className="mb-2">
              <label>Tên danh mục:</label>
              <input
                type="text"
                value={editCategoryData.category_name}
                onChange={(e) =>
                  setEditCategoryData({
                    ...editCategoryData,
                    category_name: e.target.value,
                  } as Category)
                }
                className="border p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Nội dung:</label>
              <input
                type="text"
                value={editCategoryData.decription}
                onChange={(e) =>
                  setEditCategoryData({
                    ...editCategoryData,
                    decription: e.target.value,
                  } as Category)
                }
                className="border p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Trạng thái:</label>
              <input
                type="text"
                value={editCategoryData.status}
                onChange={(e) =>
                  setEditCategoryData({
                    ...editCategoryData,
                    status: e.target.value,
                  } as Category)
                }
                className="border p-1 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2"
            >
              Lưu thay đổi
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
