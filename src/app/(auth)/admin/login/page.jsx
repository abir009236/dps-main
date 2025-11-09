"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill all the fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await signIn("credentials", {
        email,
        password,
        role: "Admin",
        redirect: false,
      });
      if (response.status === 401) {
        toast.error("Invalid Credentials");
        return;
      } else if (response.status === 200) {
        toast.success("Admin logged in successfully");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md border  border-gray-300">
        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-2">
              Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your Email"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BEFA]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-sm font-bold text-gray-600 block mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your Password"
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BEFA]"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <Button variant="primary" className="w-full" onClick={handleSubmit}>
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
