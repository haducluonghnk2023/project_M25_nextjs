import React from "react";

export default function Banner() {
  return (
    <div>
      <section className="relative bg-black text-white mt-[-1px]">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/m25-project-e7165.appspot.com/o/images%2F24-Pred-AirRush-gold-desktop-banner-button-2.jpg?alt=media&token=aba9f8f4-35db-492a-87d1-92d3584de6a1"
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
