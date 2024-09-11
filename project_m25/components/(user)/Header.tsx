import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoPersonCircleOutline } from "react-icons/io5";
import { ShoppingCart } from "lucide-react";

const Header: React.FC = () => {
  const route = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uniqueProductCount, setUniqueProductCount] = useState(0);

  const handleChangeSignIn = () => {
    route.push("/sign-in");
  };

  const handleChangeSignUp = () => {
    route.push("/sign-up");
  };

  const handleAccountClick = () => {
    route.push("/");
  };

  const handleCart = () => {
    route.push("/int/cart");
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        setIsLoggedIn(true);
        try {
          const response = await axios.get("http://localhost:8080/user");
          const user = response.data.find((user: any) => user.status === true);
          if (user) {
            await fetchUniqueProductCount(user.id);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("loi:", error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const fetchUniqueProductCount = async (userId: string) => {
    const token = localStorage.getItem("adminToken");

    try {
      const response = await axios.get(
        `http://localhost:8080/orders?user_id=${token}`
      );
      console.log("Orders data:", response);
      const orders = response.data;

      // Kiểm tra nếu không có đơn hàng
      if (!orders || orders.length === 0) {
        setUniqueProductCount(0);
        return;
      }

      const uniqueProductIds = new Set();

      orders.forEach((order: any) => {
        if (order.order_detail && Array.isArray(order.order_detail)) {
          order.order_detail.forEach((item: any) => {
            uniqueProductIds.add(item.productId); // Thêm productId vào Set
          });
        }
      });

      setUniqueProductCount(uniqueProductIds.size); // Cập nhật số lượng sản phẩm duy nhất
    } catch (error) {
      console.error("Error fetching unique product count:", error);
      setUniqueProductCount(0);
    }
  };
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/m25-project-e7165.appspot.com/o/images%2Fpredator-logo.png?alt=media&token=48650330-a7e4-477f-89b1-9705feb561d1"
          alt="Logo"
          width={150}
          height={150}
        />
        <nav>
          <ul className="flex space-x-6">
            {/* Navbar items */}
            <li>
              <a href="#" className="hover:underline">
                CUES
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                TABLES
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                SHAFTS
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                CASES
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                ACCESSORIES
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                APPAREL
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                PRO TEAM
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div
              className="flex items-center cursor-pointer"
              onClick={handleAccountClick}
            >
              <IoPersonCircleOutline />
              <span className="ml-2">Tài khoản</span>
            </div>
          ) : (
            <button onClick={handleChangeSignIn}>SIGN-IN</button>
          )}
          {!isLoggedIn && ( // Ẩn nút "CREATE AN ACCOUNT" nếu đã đăng nhập
            <button onClick={handleChangeSignUp}>CREATE AN ACCOUNT</button>
          )}
          <button className="relative">
            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs">
              {uniqueProductCount}
            </span>
            <ShoppingCart onClick={handleCart} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
