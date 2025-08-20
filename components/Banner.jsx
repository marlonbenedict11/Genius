'use client'; // Ensure this is at the top since we're using a client-side hook

import React from "react";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  const router = useRouter();

  const handleBuyNow = () => {
    router.push("/all-products");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
      <Image
        className=""
        src={assets.jbl_soundbox_image}
        alt="jbl_soundbox_image"
        width={400}
        height={300}
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          Level Up Your Gaming Experience
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
          From immersive sound to precise controls—everything you need to win
        </p>
        <button
          onClick={handleBuyNow}
          className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white"
        >
          Buy now
          <Image
            className="group-hover:translate-x-1 transition"
            src={assets.arrow_icon_white}
            alt="arrow_icon_white"
            width={20}
            height={20}
          />
        </button>
      </div>
      <Image
        className="hidden md:block"
        src={assets.md_controller_image}
        alt="md_controller_image"
        width={400}
        height={300}
      />
      <Image
        className="md:hidden"
        src={assets.sm_controller_image}
        alt="sm_controller_image"
        width={240}
        height={180}
      />
    </div>
  );
};

export default Banner;
