"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendar, FaUser, FaTag } from "react-icons/fa";

export default function BlogDetails() {
  const params = useParams();
  const { id } = params;
  const [blog, setBlog] = useState(null);
  const [categories, setCategories] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch blog details
        const blogResponse = await fetch(`/api/admin/blogs/${id}`);
        const blogData = await blogResponse.json();

        // Fetch categories and recent blogs
        const categoryResponse = await fetch("/api/category-recent_post");
        const categoryData = await categoryResponse.json();

        if (blogData?.success) {
          setBlog(blogData.blog);
        } else {
          setError(blogData.error);
        }

        if (categoryData.success) {
          setCategories(categoryData.categories);
          setRecentBlogs(categoryData.recentBlogs);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-10 px-4">
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary text-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 px-4">
        <div className="flex justify-center items-center mt-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-10 px-4">
        <div className="flex justify-center items-center mt-8">
          <p className="text-gray-500">Blog not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 ">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Blog Details Section - 70% width */}
        <div className="lg:w-[70%]">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Blog Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                {blog.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-primary" />
                  <span>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-primary" />
                  <span>Admin</span>
                </div>
              </div>
            </div>

            {/* Blog Image */}
            <div className="relative p-5 ">
              <Image
                src={blog.photo}
                alt={blog.title}
                width={800}
                height={500}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Blog Content */}
            <div className="p-6">
              {/* Main Description */}
              <div className="mb-8">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {blog.description}
                </p>
              </div>

              {/* Subtitles */}
              {blog?.subtitles && blog?.subtitles?.length > 0 && (
                <div className="space-y-6">
                  {blog.subtitles.map((subtitle, index) => (
                    <div key={index} className="border-l-4 border-primary pl-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">
                        {subtitle.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {subtitle.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Section - 30% width */}
        <div className="lg:w-[30%]">
          <div className="bg-white rounded-lg shadow-md p-5">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaTag className="text-primary" />
              Categories
            </h3>
            {categories?.length === 0 ? (
              <p className="text-gray-500">No categories available</p>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="border-b border-gray-100 pb-2"
                  >
                    <Link
                      href={`/shop?category=${encodeURIComponent(
                        category.name
                      )}`}
                      className="text-gray-700 hover:text-[#00befa] transition-colors duration-200 block py-1"
                    >
                      {category.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Posts */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Recent Posts
            </h3>
            {recentBlogs?.length === 0 ? (
              <p className="text-gray-500">No recent posts available</p>
            ) : (
              <div className="space-y-4">
                {recentBlogs.map((recentBlog) => (
                  <Link
                    key={recentBlog._id}
                    href={`/blogs/${recentBlog._id}`}
                    className="block hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200"
                  >
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <img
                          src={recentBlog.photo}
                          alt={recentBlog.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {recentBlog.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {recentBlog.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(recentBlog.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
