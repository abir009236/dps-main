"use client";
import dynamic from "next/dynamic";
// Dynamically import Lottie with no SSR
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

import faqlottie from "../../../public/assets/lottie/faqlottie.json";

export default function FaqImage() {
  return (
    <div className=" flex justify-center items-center w-1/2">
      <Lottie animationData={faqlottie} className="w-full"></Lottie>
    </div>
  );
}
