import {
  fetchProduct,
  deleteProduct,
  updateProduct,
} from "../services/all.service";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

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
  const [image, setImage] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editProductData, setEditProductData] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productsPerPage] = useState<number>(5);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productsData = await fetchProduct();
        setProducts(productsData);
        setFilteredProducts(productsData); // Khởi tạo filteredProducts
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    getProduct();
  }, [maxPrice]);

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (confirmDelete) {
      try {
        await deleteProduct(id);
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id)
        );
        if (editProductData && editProductData.id === id) {
          setIsEditing(null);
          setEditProductData(null);
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditProductData(product);
    setImage(null);
  };

  const handleSaveEdit = async () => {
    if (editProductData) {
      try {
        await updateProduct(editProductData.id, editProductData);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editProductData.id ? editProductData : product
          )
        );
        setFilteredProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === editProductData.id ? editProductData : product
          )
        );
        setIsEditing(null);
        setEditProductData(null);
        setImage(null);
      } catch (error) {
        console.error("Lỗi khi sửa sản phẩm:", error);
      }
    }
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const uploadImage = async () => {
    if (image && editProductData) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const url = await getDownloadURL(imageRef);
      const updatedProduct = { ...editProductData, image: url };
      await updateProduct(updatedProduct.id, updatedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setFilteredProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        )
      );
      setEditProductData(updatedProduct);
      setImage(null);
    }
  };

  // Hàm tìm kiếm và lọc sản phẩm
  const handleFilter = () => {
    const results = products.filter((product) => {
      const matchesSearch = product.product_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMinPrice =
        minPrice !== null ? product.unit_price >= minPrice : true;
      const matchesMaxPrice =
        maxPrice !== null ? product.unit_price <= maxPrice : true;

      return matchesSearch && matchesMinPrice && matchesMaxPrice;
    });
    setFilteredProducts(results);
    setCurrentPage(1); // Reset về trang 1 sau khi lọc
  };

  // Phân trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-1 mr-2"
        />
        <input
          type="number"
          placeholder="Giá tối thiểu"
          value={minPrice || ""}
          onChange={(e) => setMinPrice(Number(e.target.value))}
          className="border p-1 mr-2"
        />
        <input
          type="number"
          placeholder="Giá tối đa"
          value={maxPrice || ""}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="border p-1 mr-2"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Tìm kiếm
        </button>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mb-6">
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
          {currentProducts.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-2 border">{product.id}</td>
              <td className="px-4 py-2 border">
                {isEditing === product.id ? (
                  <input
                    type="text"
                    value={editProductData?.product_name || ""}
                    onChange={(e) =>
                      setEditProductData({
                        ...editProductData,
                        product_name: e.target.value,
                      } as Product)
                    }
                  />
                ) : (
                  product.product_name
                )}
              </td>
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
                {isEditing === product.id ? (
                  <button
                    className="w-[60px] h-[30px] bg-blue-500 text-white rounded"
                    onClick={handleSaveEdit}
                  >
                    Lưu
                  </button>
                ) : (
                  <button
                    className="w-[60px] h-[30px] bg-green-500 text-white rounded"
                    onClick={() => handleEdit(product)}
                  >
                    Sửa
                  </button>
                )}
                <button
                  className="w-[60px] h-[30px] bg-red-600 text-white rounded"
                  onClick={() => handleDelete(product.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Phân trang */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Trang tiếp theo
        </button>
      </div>

      {isEditing !== null && editProductData && (
        <div className="border border-gray-300 p-4 rounded">
          <h3 className="text-xl font-bold mb-2">Chỉnh sửa sản phẩm</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
              uploadImage();
            }}
          >
            <div className="mb-2">
              <label>Tên sản phẩm:</label>
              <input
                type="text"
                value={editProductData.product_name}
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    product_name: e.target.value,
                  } as Product)
                }
                className="border p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Hình ảnh:</label>
              <input
                type="file"
                onChange={handleChangeImage}
                className="border p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Mô tả:</label>
              <input
                type="text"
                value={editProductData.decription}
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    decription: e.target.value,
                  } as Product)
                }
                className="border p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Danh mục:</label>
              <input
                type="text"
                value={editProductData.category}
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    category: e.target.value,
                  } as Product)
                }
                className="border p-1 w-full"
              />
            </div>
            <div className="mb-2">
              <label>Giá:</label>
              <input
                type="number"
                value={editProductData.unit_price}
                onChange={(e) =>
                  setEditProductData({
                    ...editProductData,
                    unit_price: Number(e.target.value),
                  } as Product)
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
};

export default ProductManagement;
