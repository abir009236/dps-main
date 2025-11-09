"use client";
import { useSession } from "next-auth/react";
import React from "react";
import OverviewCards from "../components/OverviewCards";
import OrdersTable from "../components/OrdersTable";

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div className="px-2 sm:px-4 md:px-6">
      <h1 className="text-3xl font-bold text-primary mb-2">Overview</h1>
      <p className="mb-6 text-gray-600">Welcome Back, {session?.user?.name}!</p>
      <OverviewCards />
      {/* <OrdersTable /> */}
    </div>
  );
}
