import axios from 'axios';

const API_URL_CATEGORY = "http://localhost:8080/category"; 
const API_URL_USER = "http://localhost:8080/user"; 
const API_URL_PRODUCTS = "http://localhost:8080/products"; 

export const fetchCategories = async () => {
  try {
    const response = await axios.get(API_URL_CATEGORY);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu danh mục:", error);
    throw error;
  }
}; 

export const fetchUser = async () => {
  try {
    const response = await axios.get(API_URL_USER);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu danh mục:", error);
    throw error;
  }
};

export const fetchProduct = async () => {
  try {
    const response = await axios.get(API_URL_PRODUCTS);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh mục sản phẩm:", error);
    throw error;
  }
};



  export const addCategory = async (category: {
    category_name: string;
    decription: string;
    status: string;
  }) => {
    await axios.post(API_URL_CATEGORY, category);
  };

  export const addUser = async (user: {
    email: string;
    username: string;
    password: string;
    phone: string;
    address: string;
    role: string;
    status: boolean;
    avatar: string;
    created_at: Date;
  }) => {
    try {
      await axios.post(API_URL_USER, user);
    } catch (error) {
      console.error("Lỗi khi thêm người dùng:", error);
      throw error;
    }
  };