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

export default function Staff() {
  const [staffStatus, setStaffStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["staffs"],
    queryFn: () => fetch("/api/admin/staff").then((res) => res.json()),
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "Active",
    role: "Admin",
  });

  if (isLoading) return <Loading />;
  const staffs = data || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      phone: staff.phone || "",
      password: "", // leave blank to keep existing
      status: staff.status,
      role: staff.role,
    });
    setIsDialogOpen(true);
  };

  const handleAddStaff = () => {
    setEditingStaff(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      status: "Active",
      role: "Admin",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStaff) {
      const response = await fetch(`/api/admin/staff`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          status: formData.status,
          role: formData.role,
          ...(formData.password?.trim() ? { password: formData.password } : {}),
        }),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data?.error);
        return;
      } else if (data?.message) {
        toast.success("Staff updated successfully");
      }
      refetch();
    } else {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data?.error) {
        toast.error(data?.error);
        return;
      } else if (data?.message) {
        toast.success("Staff added successfully");
      }
      refetch();
    }

    setIsDialogOpen(false);
  };

  const handleDeleteStaff = async (id) => {
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
        const response = await fetch(`/api/admin/staff`, {
          method: "DELETE",
          body: JSON.stringify({ id }),
        });
        const data = await response.json();

        if (data.message) {
          Swal.fire({
            title: "Deleted!",
            text: "  s been deleted.",
            icon: "success",
          });
          refetch();
        }
      }
    });
  };

  // Filter staff based on selected filters
  const filteredStaff = staffs?.filter((staff) => {
    const matchesStatus = staffStatus === "all" || staff.status === staffStatus;
    const matchesSearch =
      searchQuery === "" ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${staff.firstName} ${staff.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="mb-20 overflow-hidden ">
      <Card className="bg-white">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <CardTitle className="text-xl sm:text-2xl lg:text-3xl text-primary font-bold mb-4 sm:mb-0">
            Staffs
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="primary"
                onClick={handleAddStaff}
                className="gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add New
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full rounded-2xl border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-primary">
                  {editingStaff ? "Edit Staff" : "Add New Staff"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1: Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* 2: Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* 3: Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* 4: Password (editable always) */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="text"
                    placeholder={
                      editingStaff
                        ? "Leave blank to keep current"
                        : "Enter password"
                    }
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingStaff}
                  />
                </div>

                {/* 5: Status */}
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
                    <SelectContent className="bg-white w-full">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Deactive">Deactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 6: Role */}
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    name="role"
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger className="w-full border-2 border-[#00befa]/50 focus:ring-2 focus:ring-[#00befa]/50">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent className="bg-white w-full">
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="primary" type="submit" className="w-full">
                  <span className="text-sm sm:text-base">
                    {editingStaff ? "Update Staff" : "Save Staff"}
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
                variant={staffStatus === "all" ? "primary" : "outline"}
                onClick={() => setStaffStatus("all")}
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                All
              </Button>
              <Button
                variant={staffStatus === "Active" ? "primary" : "outline"}
                onClick={() => setStaffStatus("Active")}
                className="text-xs sm:text-sm flex-1 sm:flex-none"
              >
                Active
              </Button>
            </div>

            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Staff Table */}
          {filteredStaff?.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="0">
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>User Profile</TableHead>
                      <TableHead>User Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff?.map((staff, index) => (
                      <TableRow key={staff._id} className="">
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{staff.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {staff.email}
                          </div>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              staff.status === "Active"
                                ? "bg-green-100 text-green-700 "
                                : "bg-red-100 text-red-700 "
                            }`}
                          >
                            {staff.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditStaff(staff)}
                              className="h-8 w-8 cursor-pointer"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteStaff(staff._id)}
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
                {filteredStaff?.map((staff, index) => (
                  <StaffCard
                    key={staff._id}
                    staff={staff}
                    index={index}
                    onEdit={() => handleEditStaff(staff)}
                    onDelete={() => handleDeleteStaff(staff._id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center py-8">
              <p className="text-gray-500 text-lg sm:text-xl">No staff found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// StaffCard component for mobile view
const StaffCard = ({ staff, index, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            #{index + 1} • {staff.name}
          </h4>
          <p className="text-xs text-gray-600 mt-1 break-words">
            {staff.email}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            staff.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {staff.status}
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
