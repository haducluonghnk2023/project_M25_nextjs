"use client";
import Banner from "@/components/(user)/Banner";
import Banner2 from "@/components/(user)/Banner2";

import Footer from "@/components/(user)/Footer";
import Header from "@/components/(user)/Header";

import MainContent2 from "@/components/(user)/MainContent2";

import React from "react";
import ProductsPage from "../products/page";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Banner />
      <ProductsPage />
      <Banner2 />
      <MainContent2 />

      <Footer />
    </div>
  );
}
