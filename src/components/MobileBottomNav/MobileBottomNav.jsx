"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Home, User, ShoppingBag, LogIn, LogOut } from "lucide-react";
import toast from "react-hot-toast";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide bottom nav on admin pages
  if (pathname?.includes("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
      active: pathname === "/",
    },
    {
      name: "Shop",
      icon: ShoppingBag,
      path: "/shop",
      active: pathname?.startsWith("/shop"),
    },
    ...(session
      ? [
          {
            name: "Profile",
            icon: User,
            path: "/profile",
            active:
              pathname?.startsWith("/profile") ||
              pathname?.startsWith("/dashboard"),
          },
          {
            name: "Logout",
            icon: LogOut,
            path: null,
            active: false,
            onClick: handleLogout,
          },
        ]
      : [
          {
            name: "Login",
            icon: LogIn,
            path: "/login",
            active: pathname === "/login",
          },
        ]),
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = item.active;

          if (item.onClick && !item.path) {
            // Logout button
            return (
              <button
                key={index}
                onClick={item.onClick}
                className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-600 group-hover:text-primary"
                  }`}
                />
                <span
                  className={`text-xs ${
                    isActive ? "text-primary font-semibold" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={index}
              href={item.path}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors duration-200 hover:bg-gray-50 active:bg-gray-100"
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive
                    ? "text-primary"
                    : "text-gray-600 group-hover:text-primary"
                }`}
              />
              <span
                className={`text-xs ${
                  isActive ? "text-primary font-semibold" : "text-gray-600"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
