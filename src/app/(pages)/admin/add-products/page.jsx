"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, X, Save, FileImage, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function AddProducts() {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    image: "",
    originalFile: null,
    details: [""],
    customerInputRequirements: [],
    pricingType: "fixed",
    fixedPrice: "",
    durationBasedPricing: [],
    availability: "in_stock",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/admin/create-category");
      const data = await response.json();
      setCategories(data?.data);
      return data?.data;
    },
    enabled: !!session,
  });

  const {
    data: products,
    isLoading: productsLoading,
    refetch: productsRefetch,
  } = useQuery({
    queryKey: ["products_admin"],
    queryFn: async () => {
      const response = await fetch("/api/admin/create-product");
      const data = await response.json();
      return data;
    },
    enabled: !!session,
  });
  if (isLoading || productsLoading) return <Loading />;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        // Convert file to base64 for preview and upload
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({
            ...prev,
            image: event.target.result,
            originalFile: file,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select a valid image file");
      }
    }
  };

  const handleDetailChange = (index, value) => {
    const newDetails = [...formData.details];
    newDetails[index] = value;
    setFormData((prev) => ({
      ...prev,
      details: newDetails,
    }));
  };

  const addDetailField = () => {
    setFormData((prev) => ({
      ...prev,
      details: [...prev.details, ""],
    }));
  };

  const removeDetailField = (index) => {
    if (formData.details.length > 1) {
      const newDetails = formData.details.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        details: newDetails,
      }));
    }
  };

  const addCustomerRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      customerInputRequirements: [
        ...prev.customerInputRequirements,
        { label: "", type: "text" },
      ],
    }));
  };

  const removeCustomerRequirement = (index) => {
    const newRequirements = formData.customerInputRequirements.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      customerInputRequirements: newRequirements,
    }));
  };

  const handleCustomerRequirementChange = (index, field, value) => {
    const newRequirements = [...formData.customerInputRequirements];
    newRequirements[index] = {
      ...newRequirements[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      customerInputRequirements: newRequirements,
    }));
  };

  const addDurationPricing = () => {
    setFormData((prev) => ({
      ...prev,
      durationBasedPricing: [
        ...prev.durationBasedPricing,
        { months: 1, price: "" },
      ],
    }));
  };

  const removeDurationPricing = (index) => {
    const newPricing = formData.durationBasedPricing.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      durationBasedPricing: newPricing,
    }));
  };

  const handleDurationPricingChange = (index, field, value) => {
    const newPricing = [...formData.durationBasedPricing];
    newPricing[index] = {
      ...newPricing[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      durationBasedPricing: newPricing,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Product Title is required");
      return;
    }

    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    // If category has subcategories, subcategory is also required
    if (
      selectedCategory &&
      selectedCategory.subcategories.length > 0 &&
      !formData.subcategory
    ) {
      toast.error("Subcategory is required for this category");
      return;
    }

    if (!formData.image) {
      toast.error("Product Image is required");
      return;
    }

    // Check if image is a valid file or URL
    if (
      formData.originalFile &&
      !formData.originalFile.type.startsWith("image/")
    ) {
      toast.error("Please select a valid image file");
      return;
    }

    if (
      !formData.details[0] ||
      formData.details.every((detail) => !detail.trim())
    ) {
      toast.error("At least one Product Detail is required");
      return;
    }

    if (formData.pricingType === "fixed" && !formData.fixedPrice) {
      toast.error("Fixed Price is required");
      return;
    }

    if (
      formData.pricingType === "duration" &&
      formData.durationBasedPricing.length === 0
    ) {
      toast.error("At least one Duration Based Price is required");
      return;
    }
    try {
      let imageUrl = formData.image;
      let imagePublicId = "";

      // If we have a new image to upload (base64 string)
      if (
        formData.originalFile &&
        formData.image &&
        formData.image.startsWith("data:image/")
      ) {
        setLoading(true);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: formData.image }),
        });

        const uploadData = await uploadResponse.json();
        if (!uploadData.success) {
          toast.error(uploadData?.error || "Failed to upload image");
          setLoading(false);
          return;
        }
        imageUrl = uploadData.imageUrl;
        imagePublicId = uploadData.publicId;
      } else if (
        typeof formData.image === "string" &&
        !formData.image.startsWith("data:image/")
      ) {
        // If image is already a URL string (not base64), use it directly
        imageUrl = formData.image;
      }
      const { image, originalFile, ...productData } = formData;
      productData.image = imageUrl;
      productData.imagePublicId = imagePublicId;
      let response;
      if (editingProduct?._id) {
        // Update existing
        response = await fetch(
          `/api/admin/create-product?id=${editingProduct._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          }
        );
      } else {
        // Create new
        response = await fetch("/api/admin/create-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        });
      }
      const data = await response.json();

      if (response.ok) {
        // Reset form and hide
        resetForm();
        productsRefetch();
        toast.success(data?.message);
      } else {
        toast.error(data?.error);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    // Populate form with product data
    setFormData({
      title: product.title || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      image: product.image || "",
      originalFile: null, // No original file when editing
      details:
        Array.isArray(product.details) && product.details.length
          ? product.details
          : [""],
      customerInputRequirements: Array.isArray(
        product.customerInputRequirements
      )
        ? product.customerInputRequirements
        : [],
      pricingType: product.pricingType || "fixed",
      fixedPrice: product.fixedPrice || "",
      durationBasedPricing: Array.isArray(product.durationBasedPricing)
        ? product.durationBasedPricing
        : [],
      availability: product.availability || "in_stock",
    });
  };

  const handleDelete = (productId, imagePublicId) => {
    Swal.fire({
      title: "Are you sure to delete the product?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            `/api/admin/create-product?id=${productId}`,
            {
              method: "DELETE",
              body: JSON.stringify({ imagePublicId }),
            }
          );
          const data = await response.json();
          if (response.ok) {
            toast.success(data?.message);
            productsRefetch();
          } else {
            toast.error(data?.error);
          }
        } catch (error) {
          toast.error("Failed to delete product");
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      subcategory: "",
      image: "",
      originalFile: null,
      details: [""],
      customerInputRequirements: [],
      pricingType: "fixed",
      fixedPrice: "",
      durationBasedPricing: [],
      availability: "in_stock",
    });
    setShowForm(false);
    setEditingProduct(null);
  };

  const selectedCategory = categories.find(
    (cat) => cat.name === formData.category
  );

  return (
    <div className="mb-20 overflow-hidden ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            Create Your Products
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Add and manage your digital products
          </p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          variant="primary"
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Add Product</span>
        </Button>
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <Button
              variant="ghost"
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Product Title */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Product Title *
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter product title"
                required
                className="w-full"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Category *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => {
                  handleInputChange("category", value);
                  handleInputChange("subcategory", "");
                }}
                required
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {categories.map((category) => (
                    <SelectItem
                      key={category._id}
                      value={category.name}
                      className="hover:bg-gray-100 focus:bg-gray-100"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory - Full width below category */}
            {selectedCategory && selectedCategory.subcategories.length > 0 && (
              <div className="space-y-2">
                <Label
                  htmlFor="subcategory"
                  className="text-sm font-medium text-gray-700"
                >
                  Subcategory *
                </Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    handleInputChange("subcategory", value)
                  }
                  required
                >
                  <SelectTrigger id="subcategory" className="w-full">
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg">
                    {selectedCategory?.subcategories?.map((sub) => (
                      <SelectItem
                        key={sub._id}
                        value={sub.name}
                        className="hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Product Image */}
            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-sm font-medium text-gray-700"
              >
                Product Image *
              </Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1 cursor-pointer"
                  required={!formData.image}
                />
                {formData.image && (
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: "" }))
                      }
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white hover:bg-red-600 w-5 h-5 sm:w-6 sm:h-6"
                    >
                      <X className="w-2 h-2 sm:w-3 sm:h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Product Details *
              </Label>
              <div className="space-y-3">
                {formData.details.map((detail, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      id={`detail-${index}`}
                      type="text"
                      value={detail}
                      onChange={(e) =>
                        handleDetailChange(index, e.target.value)
                      }
                      placeholder={`Detail point ${index + 1}`}
                      required
                      className="flex-1"
                    />
                    {formData.details.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeDetailField(index)}
                        className="px-2 sm:px-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="primary"
                  onClick={addDetailField}
                  className="flex items-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Add Detail Point</span>
                </Button>
              </div>
            </div>

            {/* Customer Input Requirements */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Customer Input Requirements
              </Label>
              <div className="space-y-3">
                {formData.customerInputRequirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-5 p-3 items-start sm:items-center border border-gray-200 rounded-lg"
                  >
                    <div className="space-y-2 flex-1">
                      <Label
                        htmlFor={`req-label-${index}`}
                        className="text-xs text-gray-600"
                      >
                        Field Label
                      </Label>
                      <Input
                        id={`req-label-${index}`}
                        type="text"
                        value={req.label}
                        onChange={(e) =>
                          handleCustomerRequirementChange(
                            index,
                            "label",
                            e.target.value
                          )
                        }
                        placeholder="Field Label"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label
                        htmlFor={`req-type-${index}`}
                        className="text-xs text-gray-600"
                      >
                        Field Type
                      </Label>
                      <Select
                        value={req.type}
                        onValueChange={(value) =>
                          handleCustomerRequirementChange(index, "type", value)
                        }
                      >
                        <SelectTrigger
                          id={`req-type-${index}`}
                          className="w-full"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem
                            value="text"
                            className="hover:bg-gray-100 focus:bg-gray-100"
                          >
                            Text
                          </SelectItem>
                          <SelectItem
                            value="email"
                            className="hover:bg-gray-100 focus:bg-gray-100"
                          >
                            Email
                          </SelectItem>
                          <SelectItem
                            value="password"
                            className="hover:bg-gray-100 focus:bg-gray-100"
                          >
                            Password
                          </SelectItem>
                          <SelectItem
                            value="number"
                            className="hover:bg-gray-100 focus:bg-gray-100"
                          >
                            Number
                          </SelectItem>
                          <SelectItem
                            value="textarea"
                            className="hover:bg-gray-100 focus:bg-gray-100"
                          >
                            Textarea
                          </SelectItem>
                          <SelectItem
                            value="select"
                            className="hover:bg-gray-100 focus:bg-gray-100"
                          >
                            Select
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      
                      onClick={() => removeCustomerRequirement(index)}
                      className="px-2 sm:px-3 self-end sm:self-center bg-red-500 hover:bg-red-600 cursor-pointer"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4 text-white hover:text-red-600" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="primary"
                  onClick={addCustomerRequirement}
                  className="flex items-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Add Requirement</span>
                </Button>
              </div>
            </div>

            {/* Pricing Type */}
            <div className="space-y-2">
              <Label
                htmlFor="pricingType"
                className="text-sm font-medium text-gray-700"
              >
                Pricing Type *
              </Label>
              <Select
                value={formData.pricingType}
                onValueChange={(value) =>
                  handleInputChange("pricingType", value)
                }
                required
              >
                <SelectTrigger id="pricingType" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem
                    value="fixed"
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    Fixed Price
                  </SelectItem>
                  <SelectItem
                    value="duration"
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    Duration Based Price
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Fixed Price */}
            {formData.pricingType === "fixed" && (
              <div className="space-y-2">
                <Label
                  htmlFor="fixedPrice"
                  className="text-sm font-medium text-gray-700"
                >
                  Fixed Price *
                </Label>
                <Input
                  id="fixedPrice"
                  type="number"
                  value={formData.fixedPrice}
                  onChange={(e) =>
                    handleInputChange("fixedPrice", e.target.value)
                  }
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                  className="w-full"
                />
              </div>
            )}

            {/* Duration Based Pricing */}
            {formData.pricingType === "duration" && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Duration Based Pricing *
                </Label>
                <div className="space-y-3">
                  {formData.durationBasedPricing.map((pricing, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="space-y-2">
                        <Label
                          htmlFor={`duration-months-${index}`}
                          className="text-xs text-gray-600"
                        >
                          Duration
                        </Label>
                        <Select
                          value={pricing.months.toString()}
                          onValueChange={(value) =>
                            handleDurationPricingChange(
                              index,
                              "months",
                              parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger
                            id={`duration-months-${index}`}
                            className="w-full"
                          >
                            <SelectValue placeholder="Select months" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 shadow-lg">
                            {[1, 2, 3, 6, 9, 12].map((month) => (
                              <SelectItem
                                key={month}
                                value={month.toString()}
                                className="hover:bg-gray-100 focus:bg-gray-100"
                              >
                                {month} {month === 1 ? "Month" : "Months"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <div className="space-y-2 flex-1">
                          <Label
                            htmlFor={`duration-price-${index}`}
                            className="text-xs text-gray-600"
                          >
                            Price
                          </Label>
                          <Input
                            id={`duration-price-${index}`}
                            type="number"
                            value={pricing.price}
                            onChange={(e) =>
                              handleDurationPricingChange(
                                index,
                                "price",
                                parseFloat(e.target.value)
                              )
                            }
                            placeholder="Price"
                            min="0"
                            step="0.01"
                            required
                            className="w-full"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeDurationPricing(index)}
                          className="px-2 sm:px-3"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDurationPricing}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm sm:text-base">
                      Add Duration Price
                    </span>
                  </Button>
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="space-y-2">
              <Label
                htmlFor="availability"
                className="text-sm font-medium text-gray-700"
              >
                Availability *
              </Label>
              <Select
                value={formData.availability}
                onValueChange={(value) =>
                  handleInputChange("availability", value)
                }
                required
              >
                <SelectTrigger id="availability" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem
                    value="in_stock"
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    In Stock
                  </SelectItem>
                  <SelectItem
                    value="out_of_stock"
                    className="hover:bg-gray-100 focus:bg-gray-100"
                  >
                    Out of Stock
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <Save className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">
                  {loading
                    ? "Processing..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer w-full sm:w-auto"
                onClick={resetForm}
              >
                <span className="text-sm sm:text-base">Cancel</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Existing Products
          </h3>
        </div>
        {products?.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">SL</TableHead>
                    <TableHead>Product Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product, index) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {product.title}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.category}
                      </TableCell>
                      <TableCell>
                        {product.pricingType === "fixed"
                          ? product.fixedPrice
                          : product.durationBasedPricing
                              .map((pricing) => pricing.price)
                              .join(", ")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.availability === "in_stock"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.availability === "in_stock"
                            ? "In Stock"
                            : "Out of Stock"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDelete(product._id, product.imagePublicId)
                            }
                            className="text-red-600 hover:text-red-700"
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
            <div className="lg:hidden p-4 space-y-4">
              {products?.map((product, index) => (
                <div
                  key={product._id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                        {product.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        #{index + 1} • {product.category}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.availability === "in_stock"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.availability === "in_stock"
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        Price:{" "}
                        {product.pricingType === "fixed"
                          ? product.fixedPrice
                          : product.durationBasedPricing
                              .map((pricing) => pricing.price)
                              .join(", ")}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.pricingType === "fixed"
                          ? "Fixed Price"
                          : "Duration Based"}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDelete(product._id, product.imagePublicId)
                        }
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500 py-8 font-bold text-lg sm:text-xl">
              No products found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
