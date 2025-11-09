"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoogleLogin from "@/components/GoogleLogin/GoogleLogin";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function Login() {
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
        role: "User",
        redirect: false,
      });
      if (response.status === 401) {
        toast.error("Invalid Credentials");
        return;
      } else if (response.status === 200) {
        router.push("/dashboard");
        toast.success("Login successful");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
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

          {/* <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#00BEFA] focus:ring-[#00BEFA] border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-[#00BEFA] hover:text-[#00a1d9]"
              >
                Forgot password?
              </Link>
            </div>
          </div> */}

          <div>
            <Button variant="primary" className="w-full" onClick={handleSubmit}>
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
          </div>
        </div>

        <div className="relative flex  items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500">
            Or Continue With
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="w-full">
          <GoogleLogin />
        </div>

        <p className="text-center  text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#00BEFA] hover:text-[#00a1d9]"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
