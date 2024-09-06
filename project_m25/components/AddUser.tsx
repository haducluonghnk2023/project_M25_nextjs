import React, { useState } from "react";

import bcrypt from "bcryptjs";
import { addUser } from "@/services/all.service";

const AddUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("user");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateInputs = () => {
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/))
      return "Email không hợp lệ.";
    if (!username.trim()) return "Họ tên không được để trống.";
    if (password.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
    if (phone && !phone.match(/^[0-9]+$/)) return "Số điện thoại không hợp lệ.";
    return null;
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError("");
    setValidationError("");

    const errorMsg = validateInputs();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const createdAt = new Date();

      const userData = {
        email,
        username,
        password: hashedPassword,
        phone,
        address,
        role,
        status: true,
        avatar: "",
        created_at: createdAt,
      };

      await addUser(userData);

      setSuccess(true);

      setEmail("");
      setUsername("");
      setPassword("");
      setPhone("");
      setAddress("");
      setRole("user");
    } catch (err) {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
      console.error("Lỗi khi thêm người dùng:", err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">Thêm Tài Khoản</h2>
        {success && (
          <p className="text-green-500 text-center mb-4">
            Thêm tài khoản thành công!
          </p>
        )}
        {validationError && (
          <p className="text-red-500 text-center mb-4">{validationError}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleAddUser}>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          {/* Fullname */}
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700 mb-2">
              Họ tên đầy đủ
            </label>
            <input
              type="text"
              id="fullname"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Nhập họ tên"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              id="phone"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 mb-2">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Nhập địa chỉ"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 mb-2">
              Vai trò
            </label>
            <select
              id="role"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Thêm Tài Khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
