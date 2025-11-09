import React from "react";

export default function OrdersTable() {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-4">
      <h2 className="text-lg font-semibold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4">Id</th>
              <th className="py-2 px-4">Product name</th>
              <th className="py-2 px-4">Order no</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Item</th>
              <th className="py-2 px-4">Total price</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
}
