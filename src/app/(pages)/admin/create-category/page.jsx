"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";

export default function CreateCategory() {
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editSubcategoryName, setEditSubcategoryName] = useState("");

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/create-category");
      const data = await response.json();
      return data?.data;
    },
  });

  if (isLoading) return <Loading />;

  // Create new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/create-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category created successfully!");
        setCategoryName("");
        refetch();
      } else {
        toast.error(data.message || "Failed to create category");
      }
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // Create new subcategory
  const handleCreateSubcategory = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!subcategoryName.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/create-category/subcategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: selectedCategory,
          name: subcategoryName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Subcategory created successfully!");
        setSubcategoryName("");
        setSelectedCategory("");
        refetch();
      } else {
        toast.error(data.message || "Failed to create subcategory");
      }
    } catch (error) {
      toast.error("Failed to create subcategory");
    } finally {
      setLoading(false);
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!editCategoryName.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/create-category", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: editingCategory._id,
          name: editCategoryName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category updated successfully!");
        setEditingCategory(null);
        setEditCategoryName("");
        refetch();
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  // Update subcategory
  const handleUpdateSubcategory = async () => {
    if (!editSubcategoryName.trim()) {
      toast.error("Please enter a subcategory name");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/admin/create-category/subcategory", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId: editingSubcategory.categoryId,
          subcategoryId: editingSubcategory._id,
          name: editSubcategoryName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Subcategory updated successfully!");
        setEditingSubcategory(null);
        setEditSubcategoryName("");
        refetch();
      } else {
        toast.error(data.message || "Failed to update subcategory");
      }
    } catch (error) {
      toast.error("Failed to update subcategory");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    Swal.fire({
      title: "Are you sure to delete this?",
      text: "This will also delete all its subcategories.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/admin/create-category?id=${categoryId}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (data.success) {
            toast.success("Category deleted successfully!");
            refetch();
          } else {
            toast.error(data.message || "Failed to delete category");
          }
        } catch (error) {
          toast.error("Failed to delete category");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Delete subcategory
  const handleDeleteSubcategory = async (categoryId, subcategoryId) => {
    Swal.fire({
      title: "Are you sure to delete this?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await fetch(
            `/api/admin/create-category/subcategory?categoryId=${categoryId}&subcategoryId=${subcategoryId}`,
            {
              method: "DELETE",
            }
          );

          const data = await response.json();

          if (data.success) {
            toast.success("Subcategory deleted successfully!");
            refetch();
          } else {
            toast.error(data.message || "Failed to delete subcategory");
          }
        } catch (error) {
          toast.error("Failed to delete subcategory");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Start editing category
  const startEditCategory = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
  };

  // Start editing subcategory
  const startEditSubcategory = (subcategory, categoryId) => {
    setEditingSubcategory({ ...subcategory, categoryId });
    setEditSubcategoryName(subcategory.name);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSubcategory(null);
    setEditCategoryName("");
    setEditSubcategoryName("");
  };

  return (
    <div className="mb-16">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
          Create Category and SubCategory
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your product categories and subcategories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Category Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-2xl lg:text-3xl">
                <span className="text-white font-bold">+</span>
              </div>
              Create New Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter category name..."
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !categoryName.trim()}
                className="w-full"
              >
                {loading ? "Creating..." : "Create Category"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Create Subcategory Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">+</span>
              </div>
              Create New Subcategory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSubcategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-9 rounded-md border border-[#00befa] bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:outline-none focus-visible:ring-[#00befa] focus-visible:ring-1"
                  disabled={loading}
                >
                  <option value="">Choose a category...</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter subcategory name..."
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                disabled={
                  loading || !selectedCategory || !subcategoryName.trim()
                }
                className="w-full"
                variant="primary"
              >
                {loading ? "Creating..." : "Create Subcategory"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Categories and Subcategories Display */}
      <div className="mt-12 mb-10 ">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-6 text-center">
          All Categories and Subcategories
        </h2>

        {loading && categories?.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading categories...</p>
          </div>
        ) : categories?.length === 0 ? (
          <Card className="text-center py-12 bg-white/80 backdrop-blur-sm">
            <p className="text-gray-600 text-lg">
              No categories found. Create your first category!
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((category) => (
              <Card
                key={category._id}
                className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {editingCategory?._id === category._id ? (
                      <div className="flex-1 mr-2">
                        <Input
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="text-lg font-semibold"
                        />
                      </div>
                    ) : (
                      <CardTitle className="text-xl font-bold text-gray-800">
                        {category.name}
                      </CardTitle>
                    )}
                    <div className="flex gap-2">
                      {editingCategory?._id === category._id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={handleUpdateCategory}
                            disabled={loading}
                            className=" bg-green-500 hover:bg-green-700 text-xs px-2 py1 text-white font-semibold cursor-pointer"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            onClick={cancelEdit}
                            disabled={loading}
                            className="text-xs px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold cursor-pointer"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            onClick={() => startEditCategory(category)}
                            disabled={loading}
                            className="bg-primary text-white cursor-pointer"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteCategory(category._id)}
                            disabled={loading}
                            className="bg-red-500 text-white cursor-pointer"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Subcategories:
                    </h4>
                    {category?.subcategories?.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">
                        No subcategories
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {category?.subcategories?.map((subcategory) => (
                          <div
                            key={subcategory._id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            {editingSubcategory?._id === subcategory._id ? (
                              <div className="flex-1 mr-2">
                                <Input
                                  value={editSubcategoryName}
                                  onChange={(e) =>
                                    setEditSubcategoryName(e.target.value)
                                  }
                                  className="text-sm"
                                />
                              </div>
                            ) : (
                              <span className="text-gray-700 font-medium">
                                {subcategory.name}
                              </span>
                            )}
                            <div className="flex gap-1">
                              {editingSubcategory?._id === subcategory._id ? (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={handleUpdateSubcategory}
                                    disabled={loading}
                                    className=" bg-green-500 hover:bg-green-700 text-xs px-2 py1 text-white font-semibold"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={cancelEdit}
                                    disabled={loading}
                                    className="text-xs px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold "
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      startEditSubcategory(
                                        subcategory,
                                        category._id
                                      )
                                    }
                                    disabled={loading}
                                    className="bg-primary text-white cursor-pointer"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteSubcategory(
                                        category._id,
                                        subcategory._id
                                      )
                                    }
                                    disabled={loading}
                                    className="bg-red-500 text-white cursor-pointer"
                                  >
                                    Delete
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
