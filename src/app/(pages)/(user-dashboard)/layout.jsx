"use client";
import Sidebar from "./components/Sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { FaEdit, FaKey, FaSignOutAlt, FaUser } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { RiPassExpiredFill } from "react-icons/ri";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();

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

  const SidebarContent = () => {
    const isActive = (href) =>
      pathname === href || pathname.startsWith(`${href}/`);
    return (
      <>
        <div className="flex flex-col items-center mb-8 ">
          <h2 className="font-semibold text-lg">
            {session?.user?.name.split(" ")[0]}
          </h2>
          <p className="text-sm ">
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
                    : "text-gray-200 hover:bg-white/10 hover:text-white")
                }
              >
                <span
                  className={
                    isActive(item.href) ? "text-[#00BEFA]" : "text-gray-300"
                  }
                >
                  {item.icon}
                </span>
                <span className="text-base">{item.name}</span>
              </div>
            </Link>
          ))}
          <div
            className="flex items-center gap-3 cursor-pointer text-red-400 hover:text-red-200 px-3 py-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-xl" />
            <span className="material-icons text-base font-semibold">
              Logout
            </span>
          </div>
        </nav>
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      <Sidebar />
      <div className="flex-1 pt-5 md:p-8">
        {/* Mobile/Tablet Menu Button - Hidden on Desktop */}
        <div className="md:hidden mb-4 ">
          <Sheet>
            <SheetTrigger asChild>
              <button className="bg-primary text-white p-2 rounded-lg shadow-lg hover:bg-blue-500 transition-colors">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-80 h-full bg-gray-600 text-white "
            >
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <div className="mt-6 h-full bg-gray-600  p-7">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {children}
      </div>
    </div>
  );
}
