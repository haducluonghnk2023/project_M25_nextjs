import { addProduct } from "@/services/all.service";
import React, { useState } from "react";
import styles from "../../styles/(admin)/AddProduct.module.scss";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { storage } from "@/config/firebase";

const AddProduct: React.FC = () => {
  const [image, setImage] = useState<any>();
  const [productData, setProductData] = useState({
    product_name: "",
    decription: "",
    status: "",
    category: "",
    unit_price: 0,
    quantity: 0,
    date: "",
    image: "",
  });
  const [message, setMessage] = useState<string>(""); // State để lưu thông báo

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]:
        name === "unit_price" || name === "quantity" ? Number(value) : value,
    });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueImage: any = e.target.files?.[0];
    setImage(valueImage);
  };

  const uploadImage = async () => {
    if (!image) return ""; // Nếu không có hình ảnh, trả về chuỗi rỗng

    const imageRef = ref(storage, `images/${image.name}`);
    const snapshot = await uploadBytes(imageRef, image);
    const url = await getDownloadURL(snapshot.ref);
    return url; // Trả về URL hình ảnh
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrl = await uploadImage(); // Đợi upload hình ảnh
      const newProductData = { ...productData, image: imageUrl }; // Thêm URL hình ảnh vào dữ liệu sản phẩm
      await addProduct(newProductData); // Gọi hàm thêm sản phẩm với dữ liệu đã cập nhật

      // Thiết lập thông báo thành công
      setMessage("Sản phẩm đã được thêm thành công!");

      // Reset form
      setProductData({
        product_name: "",
        decription: "",
        status: "",
        category: "",
        unit_price: 0,
        quantity: 0,
        date: "",
        image: "",
      });
      setImage(null); // Reset hình ảnh
    } catch (error) {
      console.error("Đã xảy ra lỗi khi thêm sản phẩm:", error);
      setMessage("Đã xảy ra lỗi khi thêm sản phẩm."); // Thiết lập thông báo lỗi
    }
  };

  return (
    <div className={styles["form-container"]}>
      <h2>Thêm sản phẩm mới</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="product_name"
          value={productData.product_name}
          onChange={handleChange}
          placeholder="Tên sản phẩm"
          required
        />
        <input
          type="text"
          name="decription"
          value={productData.decription}
          onChange={handleChange}
          placeholder="Mô tả"
          required
        />
        <select
          name="status"
          value={productData.status}
          onChange={handleChange}
          required
        >
          <option value="">Chọn trạng thái</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <input
          type="text"
          name="category"
          value={productData.category}
          onChange={handleChange}
          placeholder="Danh mục"
          required
        />
        <input
          type="number"
          name="unit_price"
          value={productData.unit_price}
          onChange={handleChange}
          placeholder="Giá sản phẩm"
          required
        />
        <input
          type="number"
          name="quantity"
          value={productData.quantity}
          onChange={handleChange}
          placeholder="Số lượng"
          required
        />
        <input
          type="date"
          name="date"
          value={productData.date}
          onChange={handleChange}
          required
        />
        <input type="file" onChange={handleChangeImage} />
        <button type="submit">Thêm sản phẩm</button>
      </form>
      {message && (
        <p className="mt-4 text-green-600">{message}</p> // Hiển thị thông báo
      )}
    </div>
  );
};

export default AddProduct;
