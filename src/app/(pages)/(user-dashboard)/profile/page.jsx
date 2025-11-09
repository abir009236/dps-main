"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaSave,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Loading from "@/components/Loading/Loading";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const { data: session, update } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["user-profile", session?._id],
    queryFn: async () => {
      const response = await fetch(`/api/users/profile?userId=${session?._id}`);
      const data = await response.json();
      setUser(data?.user);
      setFormData({
        name: data?.user?.name || "",
        phone: data?.user?.phone || "",
      });
      return data;
    },
    enabled: !!session?._id,
  });
  if (isLoading) return <Loading />;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(
        `/api/users/profile?userId=${session?._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setIsEditing(false);
        toast.success("Profile updated successfully!");

        // Update the session with new data
        await update({
          ...session,
          user: {
            ...session.user,
            name: data.user.name,
          },
          name: data.user.name,
          phone: data.user.phone,
        });
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaUser className="text-blue-600" />
            User Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 lg:grid-cols-3 grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {/* Email - Read Only */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <FaEnvelope className="text-gray-500" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="bg-gray-50 text-gray-600"
              />
              <p className="text-sm text-gray-500">Email cannot be changed</p>
            </div>

            {/* Name - Editable */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <FaUser className="text-gray-500" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
                required
              />
            </div>

            {/* Phone - Editable */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <FaPhone className="text-gray-500" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
                placeholder="Enter your phone number"
              />
            </div>

            {/* Status - Read Only */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FaShieldAlt className="text-gray-500" />
                Account Status
              </Label>
              <div className="flex items-center gap-2">
                <Badge
                  variant={user.status === "Active" ? "default" : "secondary"}
                  className={
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  {user.status}
                </Badge>
              </div>
            </div>

            {/* Role - Read Only */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FaShieldAlt className="text-gray-500" />
                Role
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{user.role}</Badge>
              </div>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-white"
              >
                <FaEdit />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="primary"
                  disabled={updating}
                  onClick={handleSubmit}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <FaSave />
                  {updating ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={updating}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
