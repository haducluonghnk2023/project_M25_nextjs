"use client";
import Banner from "@/components/(user)/Banner";
import Banner2 from "@/components/(user)/Banner2";
import Banner3 from "@/components/(user)/Banner3";
import Footer from "@/components/(user)/Footer";
import Header from "@/components/(user)/Header";
import MainContent from "@/components/(user)/MainContent";
import MainContent2 from "@/components/(user)/MainContent2";
import MainContent3 from "@/components/(user)/MainContent3";

import React, { useState } from "react";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Banner />
      <MainContent />
      <Banner2 />
      <MainContent2 />
      <Banner3 />
      <MainContent3 />
      <Footer />
    </div>
  );
}
