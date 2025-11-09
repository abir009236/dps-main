"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { MdDashboard } from "react-icons/md";
import { FaEdit, FaKey, FaSignOutAlt, FaUser } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { RiPassExpiredFill } from "react-icons/ri";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isActive = (href) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: <MdDashboard className="text-xl" />,
      href: "/dashboard",
    },
    {
      name: "Orders",
      icon: <FaEdit className="text-xl" />,
      href: "/orders",
    },
    {
      name: "Delivered Products",
      icon: <TbTruckDelivery className="text-xl" />,
      href: "/delivered-products",
    },
    // {
    //   name: "Expired Products",
    //   icon: <RiPassExpiredFill className="text-xl" />,
    //   href: "/expired-products",
    // },
    {
      name: "Change Password",
      icon: <FaKey className="text-xl" />,
      href: "/change-password",
    },
    {
      name: "Profile",
      icon: <FaUser className="text-xl" />,
      href: "/profile",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white rounded-xl shadow p-7  flex-col items-center mt-10 h-[500px] lg:h-[400px]">
        <div className="flex flex-col items-center mb-8">
          <h2 className="font-semibold text-lg">{session?.user?.name}</h2>
          <p className="text-sm text-gray-500">
            {session?.phone ? `+880${session?.phone}` : session?.user?.email}
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <div
                className={
                  `flex items-center gap-3 cursor-pointer px-3 py-2 rounded-md transition-colors ` +
                  (isActive(item.href)
                    ? "bg-[#00BEFA]/10 text-[#00BEFA] font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900")
                }
              >
                <span
                  className={
                    isActive(item.href) ? "text-[#00BEFA]" : "text-gray-500"
                  }
                >
                  {item.icon}
                </span>
                <span className="text-base">{item.name}</span>
              </div>
            </Link>
          ))}
          <div
            className="flex items-center gap-2 cursor-pointer text-red-500"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-xl" />
            <span className="material-icons text-xl font-semibold">Logout</span>
          </div>
        </nav>
      </aside>
    </>
  );
}
