"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCartShopping } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { TbLogs } from "react-icons/tb";
import { IoCall } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { SheetClose } from "@/components/ui/sheet";

const NavLinks = memo(function NavLinks() {
  const pathname = usePathname();

  const navItems = [
    { href: "/shop", icon: FaCartShopping, label: "Shop" },
    { href: "/about", icon: FaUser, label: "About Us" },
    { href: "/reviews", icon: BiSolidCategory, label: "Reviews" },
    { href: "/blogs", icon: TbLogs, label: "Blogs" },
    { href: "/contact", icon: IoCall, label: "Contact Us" },
  ];

  return (
    <nav className="flex flex-col items-start space-y-2 font-bold">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <SheetClose key={item.href} asChild>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full transition-all duration-200 ${
                isActive
                  ? "bg-white/30 text-white shadow-lg border border-white/20"
                  : "text-white/90 hover:bg-white/20 hover:text-white hover:shadow-md"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-base">{item.label}</span>
            </Link>
          </SheetClose>
        );
      })}
    </nav>
  );
});

export default NavLinks;
