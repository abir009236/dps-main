"use client";

import { useState, useEffect, useRef } from "react";

const SortDropdown = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("default");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { value: "default", label: "Default Sorting" },
    { value: "price-low", label: "Sort By Price: Low to High" },
    { value: "price-high", label: "Sort By Price: High to Low" },
    { value: "name-asc", label: "Sort By Name: A to Z" },
    { value: "name-desc", label: "Sort By Name: Z to A" },
  ];

  const handleSortChange = (value, label) => {
    setSelectedSort(value);
    onSortChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-100 min-w-[200px] cursor-pointer"
      >
        <span>
          {sortOptions.find((option) => option.value === selectedSort)?.label}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value, option.label)}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors ${
                selectedSort === option.value
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
