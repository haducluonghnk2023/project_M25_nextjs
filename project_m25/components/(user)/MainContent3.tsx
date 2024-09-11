import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "@/modals/modal";

type Product = {
  id: string;
  image: string;
  product_name: string;
  unit_price: string;
  sizes: string[];
  options: string[];
  stock: string;
  new?: boolean;
  category: string;
};

const MainContent3: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products");
        const filteredProducts = response.data.filter(
          (prod: Product) => prod.category === "Predator SP2 REVO"
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <main className="-z-50 flex-grow container mx-auto p-4 flex justify-center">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative border rounded-lg overflow-hidden shadow-md p-3 flex flex-col h-full items-center" // Thêm items-center để căn giữa
              >
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-full h-40 object-cover"
                />
                <h3 className="font-bold text-center">
                  {product.product_name}
                </h3>{" "}
                {/* Thêm text-center */}
                <span className="text-center">
                  From: ${product.unit_price}
                </span>{" "}
                {/* Thêm text-center */}
                <button className="bg-yellow-500 text-black mt-auto rounded">
                  THÊM VÀO GIỎ HÀNG
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>Không có sản phẩm nào phù hợp.</div>
        )}
      </main>
      <div></div>
    </div>
  );
};

export default MainContent3;
