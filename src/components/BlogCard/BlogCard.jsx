import Image from "next/image";
import Link from "next/link";
import { FaCalendar } from "react-icons/fa";

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 p-3">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={blog.photo}
          alt={blog.title}
          width={400}
          height={350}
          className="w-full h-72 object-cover hover:scale-110 transition-transform duration-300 "
        />
      </div>
      <div className="pt-6 flex flex-col gap-3">
        <Link
          href={`/blogs/${blog._id}`}
          className="text-2xl font-semibold text-gray-800 mb-3 line-clamp-2 cursor-pointer"
        >
          {blog.title}
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {blog.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-gray-600 text-sm flex items-center gap-2">
            <FaCalendar className="text-primary" />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <Link
            href={`/blogs/${blog._id}`}
            className="inline-flex items-center text-primary hover:text-blue-600 font-medium text-sm transition-colors duration-200"
          >
            Continue Reading
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
