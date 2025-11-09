"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Save,
  Settings,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Linkedin,
  Facebook,
  User,
  Lock,
  MessageCircle,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

export default function WebsiteSettings() {
  const [formData, setFormData] = useState({
    websiteName: "",
    websiteLogoLink: "",
    workingHours: "",
    email: "",
    phoneNumber: "",
    address: "",
    instagramLink: "",
    linkedinLink: "",
    facebookLink: "",
    whatsappNumber: "",
    telegramNumber: "",
    emailUser: "",
    emailPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Load existing settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/website-settings");
      if (response.ok) {
        const data = await response.json();
        // Ensure all fields have string values to prevent controlled/uncontrolled input error
        setFormData({
          websiteName: data.websiteName || "",
          websiteLogoLink: data.websiteLogoLink || "",
          workingHours: data.workingHours || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          instagramLink: data.instagramLink || "",
          linkedinLink: data.linkedinLink || "",
          facebookLink: data.facebookLink || "",
          whatsappNumber: data.whatsappNumber || "",
          telegramNumber: data.telegramNumber || "",
          emailUser: data.emailUser || "",
          emailPassword: data.emailPassword || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "websiteName",
      "websiteLogoLink",
      "workingHours",
      "email",
      "phoneNumber",
      "address",
      "instagramLink",
      "linkedinLink",
      "facebookLink",
      "whatsappNumber",
      "telegramNumber",
      "emailUser",
      "emailPassword",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()} is required`;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.emailUser && !emailRegex.test(formData.emailUser)) {
      newErrors.emailUser = "Invalid email user format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage("Please fix all errors before submitting");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/website-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Website settings updated successfully!");
        setErrors({});
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-primary">Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-20">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Settings className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-600">Website Settings</h1>
        </div>
        <p className="text-gray-600">
          Configure your website's general settings. All fields are required.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.includes("successfully")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Globe className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
            <CardDescription>
              Configure your website's basic details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="websiteName" className="flex items-center">
                  <span>Website Name</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="websiteName"
                  name="websiteName"
                  value={formData.websiteName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter website name"
                  className={errors.websiteName ? "border-red-500" : ""}
                />
                {errors.websiteName && (
                  <p className="text-sm text-red-500">{errors.websiteName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="websiteLogoLink" className="flex items-center">
                  <span>Website Logo Link</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="websiteLogoLink"
                  name="websiteLogoLink"
                  value={formData.websiteLogoLink || ""}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                  className={errors.websiteLogoLink ? "border-red-500" : ""}
                />
                {errors.websiteLogoLink && (
                  <p className="text-sm text-red-500">
                    {errors.websiteLogoLink}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workingHours" className="flex items-center">
                <Clock className="h-4 w-4" />
                <span>Working Hours</span>
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <Input
                id="workingHours"
                name="workingHours"
                value={formData.workingHours || ""}
                onChange={handleInputChange}
                placeholder="e.g., Monday - Friday: 9:00 AM - 6:00 PM"
                className={errors.workingHours ? "border-red-500" : ""}
              />
              {errors.workingHours && (
                <p className="text-sm text-red-500">{errors.workingHours}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Mail className="h-5 w-5" />
              <span>Contact Information</span>
            </CardTitle>
            <CardDescription>Your business contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="contact@example.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="h-4 w-4" />
                <span>Address</span>
                <span className="text-red-500 font-bold">*</span>
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleInputChange}
                placeholder="Enter your business address"
                rows={3}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Instagram className="h-5 w-5" />
              <span>Social Media Links</span>
            </CardTitle>
            <CardDescription>Your social media presence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instagramLink" className="flex items-center">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram Link</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="instagramLink"
                  name="instagramLink"
                  value={formData.instagramLink || ""}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourprofile"
                  className={errors.instagramLink ? "border-red-500" : ""}
                />
                {errors.instagramLink && (
                  <p className="text-sm text-red-500">{errors.instagramLink}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinLink" className="flex items-center">
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn Link</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="linkedinLink"
                  name="linkedinLink"
                  value={formData.linkedinLink || ""}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className={errors.linkedinLink ? "border-red-500" : ""}
                />
                {errors.linkedinLink && (
                  <p className="text-sm text-red-500">{errors.linkedinLink}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookLink" className="flex items-center">
                  <Facebook className="h-4 w-4" />
                  <span>Facebook Link</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="facebookLink"
                  name="facebookLink"
                  value={formData.facebookLink || ""}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourpage"
                  className={errors.facebookLink ? "border-red-500" : ""}
                />
                {errors.facebookLink && (
                  <p className="text-sm text-red-500">{errors.facebookLink}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messaging Platforms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <MessageCircle className="h-5 w-5" />
              <span>Messaging Platforms</span>
            </CardTitle>
            <CardDescription>
              Your WhatsApp and Telegram contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="whatsappNumber" className="flex items-center">
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp Number</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  value={formData.whatsappNumber || ""}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  className={errors.whatsappNumber ? "border-red-500" : ""}
                />
                {errors.whatsappNumber && (
                  <p className="text-sm text-red-500">
                    {errors.whatsappNumber}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegramNumber" className="flex items-center">
                  <Send className="h-4 w-4" />
                  <span>Telegram Number</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="telegramNumber"
                  name="telegramNumber"
                  value={formData.telegramNumber || ""}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900"
                  className={errors.telegramNumber ? "border-red-500" : ""}
                />
                {errors.telegramNumber && (
                  <p className="text-sm text-red-500">
                    {errors.telegramNumber}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Mail className="h-5 w-5" />
              <span>Email Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure email settings for sending emails via Nodemailer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emailUser" className="flex items-center">
                  <User className="h-4 w-4" />
                  <span>Email User</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="emailUser"
                  name="emailUser"
                  type="email"
                  value={formData.emailUser || ""}
                  onChange={handleInputChange}
                  placeholder="noreply@example.com"
                  className={errors.emailUser ? "border-red-500" : ""}
                />
                {errors.emailUser && (
                  <p className="text-sm text-red-500">{errors.emailUser}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPassword" className="flex items-center">
                  <Lock className="h-4 w-4" />
                  <span>Email Password</span>
                  <span className="text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="emailPassword"
                  name="emailPassword"
                  type="text"
                  value={formData.emailPassword || ""}
                  onChange={handleInputChange}
                  placeholder="Enter email password"
                  className={errors.emailPassword ? "border-red-500" : ""}
                />
                {errors.emailPassword && (
                  <p className="text-sm text-red-500">{errors.emailPassword}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg flex items-center space-x-2"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Update Settings</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
