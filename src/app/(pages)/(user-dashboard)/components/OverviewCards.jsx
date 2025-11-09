import React from "react";
import { Card } from "@/components/ui/card";
import {
  FaBox,
  FaCheckCircle,
  FaShoppingCart,
  FaInfoCircle,
  FaUndo,
  FaTimesCircle,
} from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/Loading/Loading";

export default function OverviewCards() {
  const { data: session } = useSession();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboardData", session?._id],
    queryFn: async () => {
      const res = await fetch(`/api/users/dashboard?userId=${session?._id}`);
      const data = await res.json();
      return data;
    },
    enabled: !!session?._id,
  });
  if (isLoading) return <Loading />;

  const stats = [
    {
      label: "Total order",
      icon: <FaBox size={24} className="text-blue-500" />,
      value: dashboardData?.totalOrders,
    },
    {
      label: "Total delivery",
      icon: <FaCheckCircle size={24} className="text-green-500" />,
      value: dashboardData?.deliverdOrders,
    },
    {
      label: "Total order pending",
      icon: <FaShoppingCart size={24} className="text-yellow-500" />,
      value: dashboardData?.pendingOrders,
    },
    {
      label: "Total order processing",
      icon: <FaInfoCircle size={24} className="text-indigo-500" />,
      value: dashboardData?.processingOrders,
    },
    {
      label: "Total order refunded",
      icon: <FaUndo size={24} className="text-orange-500" />,
      value: dashboardData?.refundedOrders,
    },
    {
      label: "Total order cancelled",
      icon: <FaTimesCircle size={24} className="text-red-500" />,
      value: dashboardData?.cancelledOrders,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="flex justify-center gap-4 p-10 transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg cursor-pointer bg-blue-50"
        >
          <div className="flex items-center gap-10">
            <span className="text-3xl">{stat.icon}</span>
            <span>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
