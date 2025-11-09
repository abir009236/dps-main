import React from "react";

export default function TitlePage({ title, description, buttonText }) {
  return (
    <div className="mb-4 flex flex-col items-center">
      <button className="bg-green-200 text-green-800 px-6 py-2 rounded-full font-medium mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-green-600 rounded-full inline-block"></span>
        {buttonText}
      </button>
      <h1 className="text-3xl font-bold text-center mb-2">{title}</h1>
      <p className="text-green-600 text-center text-base max-w-xl">
        {description}
      </p>
    </div>
  );
}
