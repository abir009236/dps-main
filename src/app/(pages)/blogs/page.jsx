"use client";
import TitlePage from "@/components/TitlePage/TitlePage";
import BlogCard from "@/components/BlogCard/BlogCard";
import React, { useState, useEffect } from "react";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/admin/blogs");
        const data = await response.json();

        if (data.success) {
          setBlogs(data.blogs);
        } else {
          setError("Failed to fetch blogs");
        }
      } catch (err) {
        setError("Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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

  return (
    <div className="py-10 px-4">
      <TitlePage
        title="Explore Our Blog"
        description="Stay updated with expert tips, news, and insights from our dedicated, passionate customer service team."
        buttonText="Read Blogs"
      />

      {blogs?.length === 0 ? (
        <div className="flex justify-center items-center mt-8">
          <p className="text-gray-500 text-lg">No blogs available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 mb-10">
          {blogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}
