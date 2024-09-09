import axios from 'axios';

const API_URL = "http://localhost:8080"; 
const API_URL_CATEGORY = "http://localhost:8080/category"; 
const API_URL_USER = "http://localhost:8080/user"; 
const API_URL_PRODUCT = "http://localhost:8080/products"; 

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
    const response = await axios.get(API_URL_PRODUCT);
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

  export const addProduct = async (product: {
    product_name: string;
    decription: string;
    status: string;
    category: string;
    unit_price: number;
    date: string;
    image: string;
  }) => {
    try {
      const response = await axios.post(API_URL_PRODUCT, product);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      throw error;
    }
  };


export const deleteProduct = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id: number, updatedData: any) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id: number, updatedData: any) => {
  try {
    const response = await axios.put(`${API_URL_CATEGORY}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteCategory = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL_CATEGORY}/${id}`);
    return response.data; 
  } catch (error) {
    throw error;
  }
};



