"use client";

import { useState } from "react";

const GridLayout = ({ onLayoutChange }) => {
  const [activeLayout, setActiveLayout] = useState("grid-3");

  const layouts = [
    {
      id: "grid-2",
      name: "2x2 Grid",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="3"
            y="3"
            width="7"
            height="7"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="14"
            y="3"
            width="7"
            height="7"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="3"
            y="14"
            width="7"
            height="7"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
          <rect
            x="14"
            y="14"
            width="7"
            height="7"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      ),
    },
    {
      id: "grid-3",
      name: "3x3 Grid",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="2"
            y="2"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="9"
            y="2"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="16"
            y="2"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="2"
            y="9"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="9"
            y="9"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="16"
            y="9"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="2"
            y="16"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="9"
            y="16"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
          <rect
            x="16"
            y="16"
            width="6"
            height="6"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      ),
    },
    {
      id: "grid-4",
      name: "4x4 Grid",
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="1" y="1" width="4" height="4" fill="currentColor" />
          <rect x="6" y="1" width="4" height="4" fill="currentColor" />
          <rect x="11" y="1" width="4" height="4" fill="currentColor" />
          <rect x="16" y="1" width="4" height="4" fill="currentColor" />
          <rect x="1" y="6" width="4" height="4" fill="currentColor" />
          <rect x="6" y="6" width="4" height="4" fill="currentColor" />
          <rect x="11" y="6" width="4" height="4" fill="currentColor" />
          <rect x="16" y="6" width="4" height="4" fill="currentColor" />
          <rect x="1" y="11" width="4" height="4" fill="currentColor" />
          <rect x="6" y="11" width="4" height="4" fill="currentColor" />
          <rect x="11" y="11" width="4" height="4" fill="currentColor" />
          <rect x="16" y="11" width="4" height="4" fill="currentColor" />
          <rect x="1" y="16" width="4" height="4" fill="currentColor" />
          <rect x="6" y="16" width="4" height="4" fill="currentColor" />
          <rect x="11" y="16" width="4" height="4" fill="currentColor" />
          <rect x="16" y="16" width="4" height="4" fill="currentColor" />
        </svg>
      ),
    },
  ];

  const handleLayoutChange = (layoutId) => {
    setActiveLayout(layoutId);
    onLayoutChange(layoutId);
  };

  return (
    <div className="flex items-center space-x-2">
      {layouts.map((layout) => (
        <button
          key={layout.id}
          onClick={() => handleLayoutChange(layout.id)}
          className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
            activeLayout === layout.id
              ? "bg-primary text-white border-primary shadow-md"
              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
          title={layout.name}
        >
          {layout.icon}
        </button>
      ))}
    </div>
  );
};

export default GridLayout;
