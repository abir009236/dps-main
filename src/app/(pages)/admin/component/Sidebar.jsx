"use client";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { LayoutDashboard, Menu, UserRound, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { BiSolidCategory } from "react-icons/bi";
import {
  FaPlus,
  FaQuestionCircle,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";
import { Book } from "lucide-react";
import { IoSettingsSharp } from "react-icons/io5";

const navMain = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  {
    label: "Create Category",
    icon: BiSolidCategory,
    href: "/admin/create-category",
  },
  { label: "Add Products", icon: FaPlus, href: "/admin/add-products" },
  { label: "Add Wallet", icon: FaPlus, href: "/admin/add-wallet" },
  { label: "Orders", icon: FaShoppingCart, href: "/admin/all-orders" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Staff", icon: UserRound, href: "/admin/staff" },
  { label: "Reviews", icon: FaStar, href: "/admin/reviews" },
  { label: "Blogs", icon: Book, href: "/admin/blogs" },
  { label: "FAQ", icon: FaQuestionCircle, href: "/admin/faq" },
  {
    label: "Website Settings",
    icon: IoSettingsSharp,
    href: "/admin/website-settings",
  },
];

export default function Sidebar({
  isSidebarOpen,
  mobileSidebar,
  setMobileSidebar,
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isActive = (href) => {
    return pathname === href;
  };
  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
    toast.success("Signed out successfully");
  };
  const SidebarContent = (
    <div className={`flex flex-col ${isSidebarOpen ? "px-4" : ""}`}>
      {/* Profile */}
      <div className="flex flex-col items-center pt-4">
        <div
          className={`text-sm  mt-2 font-bold uppercase ${
            mobileSidebar ? "text-white " : "text-primary"
          }`}
        >
          Admin
        </div>
      </div>
      {/* Main Navigation */}
      <div className="px-4 mt-4">
        <nav className="flex flex-col gap-3 lg:gap-1">
          {navMain.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center  gap-3 px-3 py-2 rounded-md md:hover:text-primary transition ${
                isActive(item.href)
                  ? "text-primary bg-gray-200 "
                  : `${mobileSidebar ? "text-white " : "text-gray-600 "}`
              }`}
            >
              <item.icon className="w-5 h-5 lg:w-7 lg:h-7 font-semibold " />
              {(isSidebarOpen || mobileSidebar) && (
                <span className="text-sm lg:text-base font-semibold ">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex  justify-center overflow-hidden`}>
        {SidebarContent}
      </div>

      {/* Mobile Sidebar */}
      <div className="flex md:hidden  ">
        <Sheet
          open={mobileSidebar}
          onOpenChange={setMobileSidebar}
          className=""
        >
          <SheetTrigger asChild>
            <button className="p-2 m-2 rounded-md border  shadow">
              <Menu />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <VisuallyHidden>
              <SheetTitle></SheetTitle>
            </VisuallyHidden>
            <div className="h-full bg-primary overflow-y-auto hide-scrollbar text-black">
              {SidebarContent}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
