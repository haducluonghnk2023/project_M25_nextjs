import React, { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  status: boolean;
  role: string;
  created_at: string;
  updated_at: string;
  is_locked: boolean;
}

const CustomerManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(3);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8080/user`, {
          params: {
            page: currentPage,
            limit: usersPerPage,
          },
        });
        const usersData = response.data;
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
  }, [currentPage]);

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

  const handleLocked = async (id: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn khóa người dùng này?"
    );
    if (!confirmed) return;
    try {
      await axios.patch(`http://localhost:8080/user/${id}`, {
        is_locked: true,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_locked: true } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_locked: true } : user
        )
      );
    } catch (error) {
      console.error("Lỗi khi khóa người dùng:", error);
    }
  };

  const handleUnlock = async (id: string) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn mở khóa người dùng này?"
    );
    if (!confirmed) return;
    try {
      await axios.patch(`http://localhost:8080/user/${id}`, {
        is_locked: false,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_locked: false } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_locked: false } : user
        )
      );
    } catch (error) {
      console.error("Lỗi khi mở khóa người dùng:", error);
    }
  };

  // Tính tổng số trang dựa trên số lượng người dùng hiện tại
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-hidden">
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
            <th className="px-4 py-2 border">Trạng thái</th>
            <th className="px-4 py-2 border">Ngày tạo</th>
            <th className="px-4 py-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers
            .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
            .map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border">{user.id}</td>
                <td className="px-4 py-2 border">{user.username}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border">
                  {user.is_locked ? "Đã khóa" : "Hoạt động"}
                </td>
                <td className="px-4 py-2 border">{user.created_at}</td>
                <td className="px-4 py-2 border flex justify-evenly">
                  <button className="w-[60px] h-[30px] bg-blue-500 text-white rounded">
                    Xem
                  </button>
                  {user.role === "user" && !user.is_locked ? (
                    <button
                      className="w-[60px] h-[30px] bg-red-500 text-white rounded"
                      onClick={() => handleLocked(user.id)}
                    >
                      Khóa
                    </button>
                  ) : user.is_locked ? (
                    <button
                      className="w-[60px] h-[30px] bg-gray-500 text-white rounded"
                      onClick={() => handleUnlock(user.id)}
                    >
                      Mở khóa
                    </button>
                  ) : (
                    <button className="w-[60px] h-[30px] bg-green-500 text-white rounded">
                      Actived
                    </button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Trang trước
        </button>
        <span>
          Trang {currentPage} / {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Trang tiếp theo
        </button>
      </div>
    </div>
  );
};

export default CustomerManagement;
