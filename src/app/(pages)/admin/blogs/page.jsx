"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, X, Save, FileImage } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photo: "",
    photoPublicId: "",
    subtitles: [],
  });

  // Fetch blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setFetching(true);
      const response = await fetch("/api/admin/blogs");
      const data = await response.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      toast.error("Error fetching blogs");
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          photo: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSubtitle = () => {
    setFormData((prev) => ({
      ...prev,
      subtitles: [...prev.subtitles, { title: "", description: "" }],
    }));
  };

  const removeSubtitle = (index) => {
    setFormData((prev) => ({
      ...prev,
      subtitles: prev.subtitles.filter((_, i) => i !== index),
    }));
  };

  const updateSubtitle = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      subtitles: prev.subtitles.map((subtitle, i) =>
        i === index ? { ...subtitle, [field]: value } : subtitle
      ),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      photo: "",
      photoPublicId: "",
      subtitles: [],
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.photo
      ) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      let imageUrl = formData.photo;
      let imagePublicId = formData.photoPublicId;

      // If it's a new image (base64), upload to Cloudinary
      if (formData.photo.startsWith("data:image")) {
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: formData.photo }),
        });

        const uploadData = await uploadResponse.json();

        if (!uploadData.success) {
          toast.error(uploadData?.error || "Failed to upload image");
          setLoading(false);
          return;
        }

        imageUrl = uploadData.imageUrl;
        imagePublicId = uploadData.publicId;
      }

      // Prepare blog data
      const blogData = {
        title: formData.title,
        description: formData.description,
        photo: imageUrl,
        photoPublicId: imagePublicId,
        subtitles: formData.subtitles,
      };

      const url = isEditing
        ? `/api/admin/blogs/${editingId}`
        : "/api/admin/blogs";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBlogs();
        resetForm();
        setShowForm(false);
        toast.success(
          isEditing
            ? "Blog updated successfully!"
            : "Blog created successfully!"
        );
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setFormData({
      title: blog.title,
      description: blog.description,
      photo: blog.photo,
      photoPublicId: blog.photoPublicId || "",
      subtitles: blog.subtitles || [],
    });
    setIsEditing(true);
    setEditingId(blog._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure to delete the blog?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`/api/admin/blogs/${id}`, {
            method: "DELETE",
          });

          const data = await response.json();

          if (data.success) {
            await fetchBlogs();
            toast.success("Blog deleted successfully!");
          } else {
            toast.error(data.error || "Something went wrong");
          }
        } catch (error) {
          toast.error("Something went wrong");
        }
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mb-20 overflow-hidden ">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            Manage Blogs
          </h1>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 text-white font-bold cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm sm:text-base">Add Blog</span>
          </Button>
        </div>

        {/* Blog Form */}
        {showForm && (
          <Card className="w-full">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg sm:text-xl">
                  {isEditing ? "Edit Blog" : "Add New Blog"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title *
                  </label>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog title"
                    required
                    className="w-full"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description *
                  </label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter blog description"
                    rows={4}
                    required
                    className="w-full"
                  />
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Photo *
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="flex-1 cursor-pointer"
                      required={!formData.photo}
                    />
                    {formData.photo && (
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <img
                          src={formData.photo}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, photo: "" }))
                          }
                          className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white hover:bg-red-600 w-5 h-5 sm:w-6 sm:h-6"
                        >
                          <X className="w-2 h-2 sm:w-3 sm:h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Subtitles */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subtitles
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSubtitle}
                      className="flex items-center gap-2 cursor-pointer w-full sm:w-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm sm:text-base">Add Subtitle</span>
                    </Button>
                  </div>

                  {formData.subtitles.map((subtitle, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg space-y-3 bg-gray-50 dark:bg-gray-800"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">
                          Subtitle {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubtitle(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          title="Remove subtitle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Enter subtitle"
                        value={subtitle.title}
                        onChange={(e) =>
                          updateSubtitle(index, "title", e.target.value)
                        }
                        required
                      />
                      <Textarea
                        placeholder="Enter subtitle description"
                        value={subtitle.description}
                        onChange={(e) =>
                          updateSubtitle(index, "description", e.target.value)
                        }
                        rows={3}
                        required
                      />
                    </div>
                  ))}
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 cursor-pointer text-white font-bold w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4" />
                    <span className="text-sm sm:text-base">
                      {loading
                        ? "Saving..."
                        : isEditing
                        ? "Update Blog"
                        : "Save Blog"}
                    </span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer w-full sm:w-auto"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    <span className="text-sm sm:text-base">Cancel</span>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Blogs Table */}
        <Card className="mb-20">
          <CardHeader className="">
            <CardTitle className="text-lg sm:text-xl">All Blogs</CardTitle>
          </CardHeader>
          <CardContent className="">
            {fetching ? (
              <div className="flex justify-center items-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-500">Loading blogs...</span>
                </div>
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-gray-500 text-lg sm:text-xl">
                  No blogs found. Create your first blog!
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">SL</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Post Date</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogs.map((blog, index) => (
                        <TableRow
                          key={blog._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <div className="truncate" title={blog.title}>
                              {blog.title}
                            </div>
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(blog.createdAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(blog)}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                title="Edit blog"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(blog._id)}
                                className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                title="Delete blog"
                              >
                                <Trash2 className="w-4 h-4" />
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
                  {blogs.map((blog, index) => (
                    <BlogCard
                      key={blog._id}
                      blog={blog}
                      index={index}
                      formatDate={formatDate}
                      onEdit={() => handleEdit(blog)}
                      onDelete={() => handleDelete(blog._id)}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// BlogCard component for mobile view
const BlogCard = ({ blog, index, formatDate, onEdit, onDelete }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
            #{index + 1} • {blog.title}
          </h4>
          <p className="text-xs text-gray-600 mt-1">
            Posted: {formatDate(blog.createdAt)}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="text-sm text-gray-700">
          <span className="font-medium">Description:</span>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {blog.description}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="flex-1 text-blue-600 hover:text-blue-700"
        >
          <Edit className="h-4 w-4 mr-1" />
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
