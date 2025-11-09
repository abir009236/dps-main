"use client";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function GoogleLogin() {
  return (
    <span>
      <Button
        variant="outline"
        className="flex items-center justify-center border-gray-300 w-full cursor-pointer hover:bg-[#00BEFA]/80 hover:text-white text-lg"
        onClick={() => {
          signIn("google", { callbackUrl: "/dashboard" });
        }}
      >
        <FaGoogle className="w-5 h-5 mr-2  hover:text-white " />
        Login With Google
      </Button>
    </span>
  );
}
