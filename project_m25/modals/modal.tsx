import React from "react";

type Product = {
  id: string;
  image: string;
  product_name: string;
  unit_price: string;
  sizes: string[];
  options: string[];
  stock: string;
  new?: boolean;
};

type ModalProps = {
  isVisible: boolean;
  product: Product | null;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isVisible, product, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-md w-full">
        {product ? (
          <>
            <h2 className="text-lg font-bold">{product.product_name}</h2>
            <p>Giá: {product.unit_price}$</p>
            <p>Tùy chọn:</p>
            {product.options && product.options.length > 0 ? (
              <select className="border rounded w-full">
                {product.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <p>Không có tùy chọn nào.</p>
            )}
            <div className="flex justify-between mt-4">
              <button
                onClick={onClose}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                HỦY BỎ
              </button>
              <button className="bg-yellow-500 text-black px-3 py-1 rounded">
                THÊM VÀO GIỎ HÀNG
              </button>
            </div>
          </>
        ) : (
          <p>Không có thông tin sản phẩm.</p>
        )}
      </div>
    </div>
  );
};

export default Modal;
