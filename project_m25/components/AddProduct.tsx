import { addProduct } from "@/services/all.service";
import React, { useState } from "react";
import styles from "../styles/(admin)/AddProduct.module.scss";

const AddProduct: React.FC = () => {
  const [productData, setProductData] = useState({
    product_name: "",
    decription: "",
    status: "",
    category: "",
    unit_price: 0,
    quantity: 0, // Thêm trường số lượng
    date: "",
    image: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addProduct(productData);
      alert("Sản phẩm đã được thêm thành công!");
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
    } catch (error) {
      alert("Đã xảy ra lỗi khi thêm sản phẩm.");
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
        <input
          type="text"
          name="image"
          value={productData.image}
          onChange={handleChange}
          placeholder="URL Hình ảnh"
          required
        />
        <button type="submit">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default AddProduct;
