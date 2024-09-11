import React from "react";

export default function Banner3() {
  return (
    <div>
      <section className="-z-50 relative bg-black text-white mt-[-1px]">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/m25-project-e7165.appspot.com/o/images%2F24-Pred-Sp2-Adventura-Apitong-Ecommerce-Web-Banner-Desktop.png?alt=media&token=e6c8247a-25b8-41c3-9202-e351f0896fe6"
          alt="Banner"
          className="w-full  object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <a
            href="#"
            className="bg-yellow-500 text-black px-6 py-2 mt-4 rounded-lg font-semibold shadow-md transition duration-300 transform hover:scale-105"
          >
            SHOP NOW
          </a>
        </div>
      </section>
    </div>
  );
}
