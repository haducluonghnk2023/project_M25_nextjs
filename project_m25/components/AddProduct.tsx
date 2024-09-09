import { addProduct } from "@/services/all.service";
import React, { useState } from "react";
import styles from "../styles/(admin)/AddProduct.module.scss";
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
          type="file"
          // value={productData.image}
          onChange={handleChangeImage}
        />
        <button type="submit" onClick={uploadImage}>
          Thêm sản phẩm
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
