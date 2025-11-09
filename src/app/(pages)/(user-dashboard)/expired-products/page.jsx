import React from 'react'

export default function ExpiredProducts() {
  return (
    <div>
    <h1 className="text-3xl font-semibold mb-3 text-primary">
      Expired Products
    </h1>
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <div className="overflow-x-auto">
        <p className="text-gray-500 text-center">
        Once your product get expired you can see the details in here
        </p>
      </div>
    </div>
  </div>
  )
}
