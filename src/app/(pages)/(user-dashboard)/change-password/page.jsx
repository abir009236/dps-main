"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function ChangePassword() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle password change logic here

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
          email: session?.user?.email,
        }),
      });

      const data = await response.json();
      if (response.status === 200) {
        toast.success(data?.message);
        formData.oldPassword = "";
        formData.newPassword = "";
        formData.confirmPassword = "";
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <h1 className="text-3xl font-semibold mb-6 text-primary">
        Change Password
      </h1>

      <div className="bg-white rounded-xl shadow p-6 mt-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Old Password *
            </label>
            <input
              type=""
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password *
            </label>
            <input
              type=""
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password *
            </label>
            <input
              type=""
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary">
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
