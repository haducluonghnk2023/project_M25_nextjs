"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import bcrypt from "bcryptjs";
import Image from "next/image";

const Account = () => {
  const route = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    username: string;
    email: string;
    phone: string;
    address: string;
    password: string;
    role: string;
    status: boolean;
    is_locked: boolean;
  }>({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    role: "",
    status: true,
    is_locked: false,
  });

  const [orders, setOrders] = useState<any[]>([]); // State for orders

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem("adminToken");
        const response = await axios.get("http://localhost:8080/user");
        const currentUser = response.data.find((u: any) => u.id === userId);
        setUser(currentUser);
        setFormData({
          username: currentUser.username || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
          password: "", // Để trống cho bảo mật
          role: currentUser.role || "",
          status: currentUser.status,
          is_locked: currentUser.is_locked,
        });
        await fetchOrders(currentUser.id); // Fetch orders for the current user
      } catch (err) {
        setError("Không thể lấy thông tin người dùng.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchOrders = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/orders?user_id=${userId}`
      );
      setOrders(response.data);
    } catch (err) {
      setError("Không thể lấy đơn hàng.");
      console.error(err);
    }
  };

  const handleBackClick = () => {
    route.push("/user");
  };

  const handleChangeOut = () => {
    localStorage.removeItem("adminToken");
    route.push("/sign-in");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...formData,
        password: formData.password
          ? await bcrypt.hash(formData.password, 10)
          : user.password,
      };

      await axios.put(`http://localhost:8080/user/${user.id}`, updatedData);
      setUser({ ...user, ...updatedData });
      setIsEditing(false);
    } catch (err) {
      setError("Không thể cập nhật thông tin người dùng.");
      console.error(err);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      password: "",
      role: user.role || "",
      status: user.status,
      is_locked: user.is_locked,
    });
    setIsEditing(false);
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <button onClick={handleBackClick} className="mb-4 hover:underline">
        Quay về trang chính
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center">Tài khoản của tôi</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="col-span-1 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Tài khoản của tôi</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-blue-500">
                Đơn hàng của tôi
              </a>
            </li>
            <li>
              <button onClick={handleChangeOut}>Đăng xuất</button>
            </li>
          </ul>
        </div>

        <div className="col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Thông tin tài khoản
            </h2>
            <div className="border-b-2 pb-2 mb-4 border-gray-300">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 mb-2 w-full"
                    placeholder="Tên người dùng"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 mb-2 w-full"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 mb-2 w-full"
                    placeholder="Số điện thoại"
                  />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 mb-2 w-full"
                    placeholder="Địa chỉ"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border rounded-lg p-2 mb-2 w-full"
                    placeholder="Mật khẩu mới (để trống nếu không thay đổi)"
                  />
                </>
              ) : (
                <>
                  <p className="text-gray-700">
                    {user.username || "Tên người dùng"}
                  </p>
                  <p className="text-gray-700">{user.email || "Email"}</p>
                  <p className="text-gray-700">
                    {user.phone || "Số điện thoại"}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-between mt-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-600 hover:underline font-medium"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Đơn hàng của tôi
            </h2>
            {orders.length > 0 ? (
              <ul className="space-y-2">
                {orders.map((order) => (
                  <li key={order.id} className="border-b py-2">
                    <p className="text-gray-700">Đơn hàng ID: {order.id}</p>
                    <p className="text-gray-600">
                      Tổng tiền: $ {order.total_price}
                    </p>
                    <ul className="ml-4 mt-2">
                      {order.order_detail.map((item: any) => (
                        <li
                          key={item.productId}
                          className="flex items-center text-gray-500"
                        >
                          <Image
                            src={item.image}
                            alt="loi"
                            width={50}
                            height={50}
                          ></Image>
                          <span>
                            - {item.productName}: {item.quantity} x $
                            {item.unitPrice}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
