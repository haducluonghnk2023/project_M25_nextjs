import React from "react";
import Slider from "react-slick";

const banners = [
  {
    img: "https://firebasestorage.googleapis.com/v0/b/m25-project-e7165.appspot.com/o/images%2F24-Blak-Radial-Kaci-1-1920x667px.png?alt=media&token=dfd39870-c621-4e09-adfe-1694be2b65d6",
    alt: "Banner 1",
  },
  {
    img: "https://firebasestorage.googleapis.com/v0/b/m25-project-e7165.appspot.com/o/images%2FImage20240702101059.jpg?alt=media&token=24ff974a-d340-4329-9d3e-c77d37f28dfa",
    alt: "Banner 2",
  },
  {
    img: "https://firebasestorage.googleapis.com/v0/b/m25-project-e7165.appspot.com/o/images%2F24-Pred-AirRush-gold-desktop-banner-button-2.jpg?alt=media&token=aba9f8f4-35db-492a-87d1-92d3584de6a1",
    alt: "Banner 3",
  },
];

export default function Banner2() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Slider {...settings}>
        {banners.map((banner, index) => (
          <section key={index} className="relative bg-black text-white">
            <img
              src={banner.img}
              alt={banner.alt}
              className="w-full object-cover"
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
        ))}
      </Slider>
    </div>
  );
}
