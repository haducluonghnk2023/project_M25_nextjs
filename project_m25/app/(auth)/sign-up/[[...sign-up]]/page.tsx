"use client";
import React, { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await axios.post("http://localhost:8080/user", {
        username,
        email,
        fullname,
        phone,
        addrees: address,
        password: hashedPassword,
        role: "user",
      });
      console.log(response.data);

      if (response.data.success) {
        setError("Đăng ký không thành công. Vui lòng thử lại.");
      } else {
        setSuccess("Đăng ký thành công!");
        setUsername("");
        setEmail("");
        setFullname("");
        setPhone("");
        setAddress("");
        setPassword("");
        setConfirmPassword("");

        router.push("/sign-in");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Có lỗi xảy ra.");
      } else {
        setError("Không thể kết nối tới server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold text-center mb-5">Đăng ký</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSignUp} className="bg-white p-6 shadow-md rounded">
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fullname" className="block text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 mb-2">
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 mb-2">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}
