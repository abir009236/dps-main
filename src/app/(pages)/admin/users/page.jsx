"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pencil, Trash2, UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "@/components/Loading/Loading";

export default function Users() {
  const [userStatus, setUserStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/admin/users").then((res) => res.json()),
  });

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    status: "Active",
  });
  if (isLoading) return <Loading />;
  const users = data || [];
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      email: user.email || "",
      name: user.name || "",
      phone: user.phone || "",
      password: "",
      status: user.status || "Active",
    });
    setIsDialogOpen(true);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      email: "",
      name: "",
      phone: "",
      password: "",
      status: "Active",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingUser) {
      const response = await fetch(`/api/admin/users`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          status: formData.status,
          // send password only if provided
          ...(formData.password?.trim() ? { password: formData.password } : {}),
        }),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data?.error);
        return;
      } else if (data?.message) {
        toast.success("User updated successfully");
      }
      refetch();
    }
    setIsDialogOpen(false);
  };

  // Filter users based on selected filters
  const filteredUsers = users?.filter((user) => {
    const matchesStatus = userStatus === "all" || user.status === userStatus;
    const matchesSearch =
      searchQuery === "" ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.name}`.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });
  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await fetch(`/api/admin/users`, {
          method: "DELETE",
          body: JSON.stringify({ id }),
        });
        const data = await response.json();
        if (data?.message) {
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
          });
          refetch();
        }
      }
    });
  };
  return (
    <div className="mb-20 overflow-hidden ">
      <Card className="bg-white">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between ">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-primary font-bold mb-4 sm:mb-0">
            Users
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent className="dark:bg-slate-700 max-w-lg w-full rounded-2xl border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">
                  {editingUser ? "Edit User" : "Add New User"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Email (readOnly) */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    readOnly
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-slate-600 dark:border-slate-500 read-only:opacity-80"
                  />
                </div>

                {/* Row 2: Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="dark:bg-slate-600 dark:border-slate-500"
                  />
                </div>

                {/* Row 3: Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="dark:bg-slate-600 dark:border-slate-500"
                  />
                </div>

                {/* Row 4: Password (editable) */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="text"
                    placeholder="Current password is hidden • leave blank to keep it"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="dark:bg-slate-600 dark:border-slate-500"
                  />
                  <p className="text-xs text-gray-500">
                    For security, we cannot display the existing password. Enter
                    a new one to change it; leave blank to keep the current
                    password.
                  </p>
                </div>

                {/* Row 5: Status */}
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    name="status"
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="w-full border-2 border-[#00befa]/50 focus:ring-2 focus:ring-[#00befa]/50">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Deactive">Deactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="primary" type="submit" className="w-full">
                  <span className="text-sm sm:text-base">
                    {editingUser ? "Update User" : "Save User"}
                  </span>
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Filters Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                variant={userStatus === "all" ? "primary" : "outline"}
                onClick={() => setUserStatus("all")}
                className="cursor-pointer text-xs sm:text-sm flex-1 sm:flex-none"
              >
                All
              </Button>
              <Button
                variant={userStatus === "Active" ? "primary" : "outline"}
                onClick={() => setUserStatus("Active")}
                className="cursor-pointer text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Active
              </Button>
              <Button
                variant={userStatus === "Deactive" ? "secondary" : "outline"}
                onClick={() => setUserStatus("Deactive")}
                className="cursor-pointer text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Deactive
              </Button>
            </div>

            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 dark:text-white"
              />
            </div>
          </div>

          {/* Users Table */}
          {filteredUsers?.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="font-bold">
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>User Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((user, index) => (
                      <TableRow key={user._id} className="text-base">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-base font-medium ${
                              user.status === "Active"
                                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {user.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 cursor-pointer"
                            >
                              <Pencil className="h-4 w-4 cursor-pointer" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user._id)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {filteredUsers?.map((user, index) => (
                  <UserCard
                    key={user._id}
                    user={user}
                    index={index}
                    onEdit={() => handleEditUser(user)}
                    onDelete={() => handleDeleteUser(user._id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500 text-lg sm:text-xl">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// UserCard component for mobile view
const UserCard = ({ user, index, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            #{index + 1} • {user.name}
          </h4>
          <p className="text-xs text-gray-600 mt-1 break-words">{user.email}</p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            user.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.status}
        </span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 text-blue-600 hover:text-blue-700"
        >
          <Pencil className="h-4 w-4 mr-1" />
          <span className="text-xs sm:text-sm">Edit</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          className="flex-1 text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          <span className="text-xs sm:text-sm">Delete</span>
        </Button>
      </div>
    </div>
  );
};
