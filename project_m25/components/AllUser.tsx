import { fetchUser } from "@/services/all.service";
import React, { useEffect, useState } from "react";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

const CustomerManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersData = await fetchUser();
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        setError("Lỗi khi lấy danh sách người dùng.");
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = search.toLowerCase();
      setFilteredUsers(
        users.filter(
          (user) =>
            user.username.toLowerCase().includes(lowercasedSearch) ||
            user.email.toLowerCase().includes(lowercasedSearch)
        )
      );
    }
  }, [search, users]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <label htmlFor="search" className="block text-gray-700 mb-2">
          Tìm kiếm
        </label>
        <input
          type="text"
          id="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Tìm kiếm theo tên đăng nhập hoặc email"
        />
      </div>
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Tên đăng nhập</th>
            <th className="px-4 py-2 border">Email</th>
            <th className="px-4 py-2 border">Role</th>
            <th className="px-4 py-2 border">Ngày tạo</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2 border">{user.id}</td>
              <td className="px-4 py-2 border">{user.username}</td>
              <td className="px-4 py-2 border">{user.email}</td>
              <td className="px-4 py-2 border">{user.role}</td>
              <td className="px-4 py-2 border">{user.created_at}</td>
              <td className="px-4 py-2 border flex justify-evenly">
                <button className="w-[60px] h-[30px] bg-blue-500 text-white rounded">
                  Xem
                </button>
                {user.role === "user" ? (
                  <button className="w-[60px] h-[30px] bg-red-500 text-white rounded">
                    Khóa
                  </button>
                ) : (
                  <button className="w-[60px] h-[30px] bg-green-500 text-white rounded">
                    Active
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerManagement;
