import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const eightHoursAgo = new Date(Date.now() - 8 * 60 * 60 * 1000);

    const [
      totalProducts,
      totalOrdersCount,
      deliveredOrders,
      refundOrders,
      cancelOrders,
      sellAgg,
      recentOrdersRaw,
    ] = await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.countDocuments({ status: "delivered" }),
      Order.countDocuments({ status: "refunded" }),
      Order.countDocuments({ status: "cancelled" }),
      Order.aggregate([
        { $match: { status: "delivered" } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]),
      Order.find({ createdAt: { $gte: eightHoursAgo } })
        .populate({ path: "user", select: "name" })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const totalSell = sellAgg?.[0]?.total || 0;

    const recentOrders = recentOrdersRaw.map((o) => {
      const firstProductName = o.products?.[0]?.productName || "-";
      const extraCount = Math.max((o.products?.length || 0) - 1, 0);
      return {
        id: String(o._id),
        userName: o.user?.name || "Unknown",
        productLabel:
          extraCount > 0
            ? `${firstProductName} +${extraCount}`
            : firstProductName,
        totalPrice: o.totalPrice,
        paymentMethod: o.paymentMethod,
        status: o.status,
        createdAt: o.createdAt,
      };
    });

    // Get all data in optimized queries
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [sales24hData, sales7dData, paymentData] = await Promise.all([
      // 24-hour sales data by hour
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: twentyFourHoursAgo },
            status: "delivered",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%H",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            sales: { $sum: 1 },
            income: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),
      // 7-day sales data by day
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            status: "delivered",
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
                timezone: "UTC",
              },
            },
            sales: { $sum: 1 },
            income: { $sum: "$totalPrice" },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]),
      // Payment method data - only specific gateways
      Order.aggregate([
        {
          $match: {
            paymentMethod: {
              $in: ["bkash", "nagad", "rocket", "uddoktapay", "refund-balance"],
            },
          },
        },
        {
          $group: {
            _id: "$paymentMethod",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]),
    ]);

    // Process 24-hour data
    const sales24hMap = new Map();
    sales24hData.forEach((item) => {
      sales24hMap.set(item._id, { sales: item.sales, income: item.income });
    });

    const sales24h = [];
    const now = new Date();
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour24 = hour.getUTCHours().toString().padStart(2, "0");
      const hour12 = hour.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });

      const hourData = sales24hMap.get(hour24) || { sales: 0, income: 0 };
      sales24h.push({
        time: hour12,
        sales: hourData.sales,
        income: hourData.income,
      });
    }

    // Process 7-day data
    const sales7dMap = new Map();
    sales7dData.forEach((item) => {
      sales7dMap.set(item._id, { sales: item.sales, income: item.income });
    });

    const sales7d = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayKey = day.toISOString().split("T")[0];
      const dayName = day.toLocaleDateString("en-US", { weekday: "short" });

      const dayData = sales7dMap.get(dayKey) || { sales: 0, income: 0 };
      sales7d.push({
        time: dayName,
        sales: dayData.sales,
        income: dayData.income,
      });
    }

    const totalOrders = paymentData.reduce((sum, item) => sum + item.count, 0);
    const paymentChartData = paymentData.map((item) => ({
      name: item._id || "Unknown",
      value:
        totalOrders > 0 ? ((item.count / totalOrders) * 100).toFixed(1) : 0,
      color: getPaymentMethodColor(item._id),
    }));

    function getPaymentMethodColor(method) {
      const colors = {
        bkash: "#ec4899",
        nagad: "#3b82f6",
        rocket: "#10b981",
        uddoktapay: "#f59e0b",
        "refund balance": "#8b5cf6",
      };
      return colors[method?.toLowerCase()] || "#6b7280";
    }

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalProducts,
          totalOrders: totalOrdersCount,
          deliveredOrders,
          refundOrders,
          cancelOrders,
          totalSell,
        },
        recentOrders,
        chartData: {
          sales24h,
          sales7d,
          paymentData: paymentChartData,
        },
      },
    });
  } catch (error) {
    console.error("/api/admin/dashboard GET error", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
