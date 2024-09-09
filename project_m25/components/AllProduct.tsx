import {
  fetchProduct,
  deleteProduct,
  updateProduct,
} from "../services/all.service";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import axios from "axios";

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
  const [image, setImage] = useState<any>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editProductData, setEditProductData] = useState<Product | null>(null);

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

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (confirmDelete) {
      try {
        await deleteProduct(id); // Gọi API xóa sản phẩm
        setProducts(products.filter((product) => product.id !== id)); // Cập nhật danh sách sản phẩm
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditProductData(product);
  };

  const handleSaveEdit = async () => {
    if (editProductData) {
      try {
        await updateProduct(editProductData.id, editProductData);
        setProducts(
          products.map((product) =>
            product.id === editProductData.id ? editProductData : product
          )
        );
        setIsEditing(null);
        setEditProductData(null);
      } catch (error) {
        console.error("Lỗi khi sửa sản phẩm:", error);
      }
    }
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valueImage: any = e.target.files?.[0];
    console.log("111111111", valueImage);
    setImage(valueImage);
  };

  const uploadImage = () => {
    const imageRef = ref(storage, `images/${image}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log(1111, url);
        const product = {
          image: url,
        };
        axios.post(" http://localhost:8080/products", product);
      });
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h2>

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
          {products.map((product) => (
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
                    onClick={handleSaveEdit} // Gọi hàm lưu sửa
                  >
                    Lưu
                  </button>
                ) : (
                  <button
                    className="w-[60px] h-[30px] bg-green-500 text-white rounded"
                    onClick={() => handleEdit(product)} // Gọi hàm sửa
                  >
                    Sửa
                  </button>
                )}
                <button
                  className="w-[60px] h-[30px] bg-red-600 text-white rounded"
                  onClick={() => handleDelete(product.id)} // Gọi hàm xóa
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form sửa sản phẩm */}
      {isEditing !== null && editProductData && (
        <div className="border border-gray-300 p-4 rounded">
          <h3 className="text-xl font-bold mb-2">Chỉnh sửa sản phẩm</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveEdit();
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
                // value={editProductData.image}
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
              onClick={uploadImage}
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
