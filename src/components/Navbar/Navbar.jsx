"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Search,
  X,
  ChevronDown,
  ArrowRight,
  ShoppingCart,
  LogOut,
  User2,
} from "lucide-react";
import { FaEdit, FaKey, FaUser } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MdDashboard } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import NavLinks from "./components/NavLinks";
import TopBar from "./components/TopBar";
import CartDrawer from "./components/CartDrawer";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [settings, setSettings] = useState({});
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [catOpen, setCatOpen] = useState(false); // desktop hover panel
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const pathname = usePathname();

  const mainNavRef = useRef(null);
  const topBarRef = useRef(null);
  const [mainNavHeight, setMainNavHeight] = useState(0);
  useEffect(() => {
    setIsMounted(true);

    if (mainNavRef.current) {
      setMainNavHeight(mainNavRef.current.offsetHeight);
    }

    const handleScroll = () => {
      const topBarHeight = topBarRef.current
        ? topBarRef.current.offsetHeight
        : 50;
      setIsSticky(window.scrollY > topBarHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadCart = useCallback(async () => {
    try {
      if (session?.id || session?._id) {
        const userId = session?._id || session?.id;
        const res = await fetch(`/api/cart?userId=${userId}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setCartItems(data?.cart?.products || []);
      } else {
        const ls = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(ls);
      }
    } catch (e) {
      console.error("load cart failed", e);
    }
  }, [session]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  useEffect(() => {
    let cancelled = false;
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/admin/website-settings", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled)
          setSettings((prev) =>
            JSON.stringify(prev) === JSON.stringify(data) ? prev : data || {}
          );
      } catch (e) {
        // ignore
      }
    };
    loadSettings();
    // Load categories (public)
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/category-recent_post", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        // try common shapes
        const list = Array.isArray(data?.categories)
          ? data.categories
          : Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];
        if (!cancelled) setCategories(list);
      } catch (e) {
        console.error("Error loading categories:", e);
        // ignore
      }
    };
    loadCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleCartUpdated = () => loadCart();
    const handleStorage = (e) => {
      if (e.key === "cart") loadCart();
    };
    window.addEventListener("cartUpdated", handleCartUpdated);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadCart]);

  const handleLogout = useCallback(async () => {
    toast.success("Logged out successfully");
    await signOut({ callbackUrl: "/" });
  }, []);

  const handleRemoveFromCart = useCallback(
    async (cartId) => {
      try {
        if (session?.id || session?._id) {
          const response = await fetch(
            `/api/products/${session?._id || session?.id}?cartId=${cartId}`,
            { method: "DELETE" }
          );
          const data = await response.json();
          if (response.ok) {
            toast.success(data?.message);
            loadCart();
          } else {
            toast.error(data?.error);
          }
        } else {
          const ls = JSON.parse(localStorage.getItem("cart") || "[]");
          const filtered = ls.filter((p) => p._id !== cartId);
          localStorage.setItem("cart", JSON.stringify(filtered));
          window.dispatchEvent(new Event("cartUpdated"));
          toast.success("Removed from cart");
        }
      } catch (error) {
        toast.error("Failed to remove from cart");
      }
    },
    [loadCart, session]
  );

  const handleUpdateQty = useCallback(
    async (cartId, nextQty) => {
      try {
        if (session?.id || session?._id) {
          const res = await fetch(
            `/api/products/${session?._id || session?.id}?cartId=${cartId}`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quantity: nextQty }),
            }
          );
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Failed");
          loadCart();
        } else {
          const ls = JSON.parse(localStorage.getItem("cart") || "[]");
          const updated = ls
            .map((p) => (p._id === cartId ? { ...p, quantity: nextQty } : p))
            .filter((p) => p.quantity > 0);
          localStorage.setItem("cart", JSON.stringify(updated));
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (e) {
        toast.error("Failed to update quantity");
      }
    },
    [loadCart, session]
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      ),
    [cartItems]
  );

  if (!isMounted) {
    return null;
  }

  TopBar.displayName = "TopBar";

  return pathname?.includes("/admin/login") || pathname.includes("/admin") ? (
    ""
  ) : (
    <>
      <div className="relative">
        <TopBar
          ref={topBarRef}
          settings={settings}
          cartCount={cartItems?.length || 0}
          onOpenCart={() => setIsCartOpen(true)}
          searchValue={searchText}
          onSearchChange={(e) => setSearchText(e.target.value)}
          onSearchSubmit={() => {
            const q = searchText.trim();
            if (!q) return;
            router.push(`/shop?search=${encodeURIComponent(q)}`);
          }}
        />

        {isSticky && <div style={{ height: `${mainNavHeight}px` }} />}

        <div
          ref={mainNavRef}
          className={`w-full bg-white z-40 pt-5 pb-3 transition-all duration-300 ease-in-out ${
            isSticky ? "fixed top-0 left-0 right-0 shadow-md" : "relative"
          }`}
        >
          <div className="container mx-auto px-4 ">
            {/* Mobile & Tablet Navbar */}
            <div className="lg:hidden h-10 flex  items-center justify-between space-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Menu className="h-7 w-7" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[320px] bg-gradient-to-br from-gray-700 to-gray-700 border-r-0 text-white px-6 pb-6 flex flex-col overflow-y-auto"
                >
                  <SheetHeader className="text-left">
                    <SheetTitle className="hidden">Navigation Menu</SheetTitle>
                    <SheetDescription className="hidden">
                      Main navigation links and options.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetClose
                    asChild
                    className="absolute top-4 right-4"
                  ></SheetClose>

                  {/* Website Name */}
                  <div className="text-center ">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-[#00BEFA] to-[#88E789] bg-clip-text text-transparent">
                      {settings?.websiteName || "Digital Store"}
                    </h2>
                    <p className="text-white/70 text-sm mt-0">
                      Welcome to our store
                    </p>
                  </div>

                  <div
                    className="bg-white/20 text-white p-4 rounded-lg flex items-center justify-between space-x-2 cursor-pointer my-4 transition-all duration-200 hover:bg-white/30 hover:shadow-lg"
                    onClick={() => setMobileCatOpen((v) => !v)}
                  >
                    <div className="flex items-center space-x-3">
                      <Menu className="h-5 w-5" />
                      <span className="font-semibold text-base">
                        All Categories
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform duration-200 ${
                        mobileCatOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {mobileCatOpen && (
                    <div className="bg-white/10 rounded-md mb-4 mt-1">
                      {categories.map((c, idx) => (
                        <button
                          key={c._id || c.id || idx}
                          className="w-full text-left px-4 py-2 hover:bg-white/20 hover:underline"
                          onClick={() => {
                            setIsCartOpen(false);
                            router.push(
                              `/shop?category=${encodeURIComponent(
                                c.name || c.title || c.category || ""
                              )}`
                            );
                          }}
                        >
                          {(c.name || c.title || c.category || "").toString()}
                        </button>
                      ))}
                    </div>
                  )}

                  <NavLinks />

                  <div className="mt-auto space-y-4">
                    {session?.user ? (
                      <div className="space-y-4">
                        {/* Profile Section */}
                        <div className="bg-white/20 rounded-lg p-4 flex items-center space-x-3 border border-white/10">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {session?.user?.name?.charAt(0)?.toUpperCase() ||
                              session?.user?.email?.charAt(0)?.toUpperCase() ||
                              "U"}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold text-base">
                              {session?.user?.name || "User"}
                            </p>
                            <p className="text-white/70 text-sm">
                              {session?.user?.email}
                            </p>
                          </div>
                        </div>

                        {/* Logout Button */}
                        <Button
                          onClick={() => handleLogout()}
                          className="w-full bg-red-500 hover:bg-red-600 text-white justify-center text-lg py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                          <span className="flex items-center gap-2">
                            <span>Logout</span>
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          asChild
                          className="w-full bg-white text-primary justify-center text-lg py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:bg-white/90"
                        >
                          <Link href="/login">
                            Sign In <ArrowRight className="ml-2 h-5 w-5" />
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full bg-white text-primary justify-center text-lg py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:bg-white/90"
                        >
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex-grow flex justify-center w-full">
                {isSearchOpen ? (
                  <div className="w-full flex items-center relative">
                    <Search className="absolute left-4 h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Tools"
                      className="w-full pl-12 pr-4 py-3 border-2 border-[#00BEFA] rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BEFA]"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const q = searchText.trim();
                          if (!q) return;
                          setIsSearchOpen(false);
                          router.push(`/shop?search=${encodeURIComponent(q)}`);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <Link
                    href="/"
                    className="text-xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-[#00BEFA] to-[#88E789] bg-clip-text text-transparent"
                  >
                    {settings?.websiteName || ""}
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="flex items-center"
                  onClick={() => setIsCartOpen(true)}
                >
                  <ShoppingCart className="h-7 w-7" />
                  <span className="font-bold relative text-lg">
                    <span className="absolute -top-6 -right-3 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs ">
                      {cartItems?.length || 0}
                    </span>
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="flex-shrink-0"
                >
                  {isSearchOpen ? (
                    <X className="h-7 w-7" />
                  ) : (
                    <Search className="h-7 w-7" />
                  )}
                </Button>
              </div>
            </div>

            {/* Desktop Navbar */}
            <div className="hidden lg:flex flex-col">
              <div className="flex justify-between items-center pb-4">
                <div className="flex items-center space-x-8">
                  <div
                    className="relative bg-primary w-72 text-white px-6 py-3 rounded-lg flex items-center justify-between space-x-2 cursor-pointer"
                    onMouseEnter={() => setCatOpen(true)}
                    onMouseLeave={() => setCatOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <Menu />
                      <span className="font-semibold text-lg">
                        All Categories
                      </span>
                    </div>
                    <ChevronDown />
                    {catOpen && (
                      <div className="absolute left-0 top-full mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg border z-50 p-2">
                        {categories.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No categories
                          </div>
                        ) : (
                          categories.map((c, idx) => (
                            <button
                              key={c._id || c.id || idx}
                              className="w-full text-left px-3 py-2 rounded hover:bg-blue-100 cursor-pointer"
                              onClick={() => {
                                router.push(
                                  `/shop?category=${encodeURIComponent(
                                    c.name || c.title || c.category || ""
                                  )}`
                                );
                                setCatOpen(false);
                              }}
                            >
                              {(
                                c.name ||
                                c.title ||
                                c.category ||
                                ""
                              ).toString()}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <nav className="flex space-x-8 text-xl font-bold">
                    <Link
                      href="/shop"
                      className={`text-gray-700  hover:text-primary ${
                        pathname.includes("shop") ? "text-primary" : ""
                      }`}
                    >
                      Shop
                    </Link>
                    <Link
                      href="/about"
                      className={`text-gray-700  hover:text-primary ${
                        pathname.includes("about") ? "text-primary" : ""
                      }`}
                    >
                      About Us
                    </Link>
                    <Link
                      href="/reviews"
                      className={`text-gray-700  hover:text-primary ${
                        pathname.includes("reviews") ? "text-primary" : ""
                      }`}
                    >
                      Reviews
                    </Link>
                    <Link
                      href="/blogs"
                      className={`text-gray-700 hover:text-primary ${
                        pathname.includes("blogs") ? "text-primary" : ""
                      }`}
                    >
                      Blogs
                    </Link>
                    <Link
                      href="/contact"
                      className={`text-gray-700  hover:text-primary ${
                        pathname.includes("contact") ? "text-primary" : ""
                      }`}
                    >
                      Contact Us
                    </Link>
                  </nav>
                </div>

                {session?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <p className="cursor-pointer flex items-center gap-2">
                        <User2 className="cursor-pointer" />{" "}
                        {session?.user?.name}
                      </p>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 bg-white shadow-md border-gray-200"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Hello{" "}
                            <span className="font-bold text-primary ml-2">
                              {session?.user?.name || "User"}
                            </span>
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard`} className="cursor-pointer ">
                          <MdDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/orders`} className="cursor-pointer">
                          <FaEdit className="mr-2 h-4 w-4" />
                          <span>Orders</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/delivered-products`}
                          className="cursor-pointer"
                        >
                          <TbTruckDelivery className="mr-2 h-4 w-4" />
                          <span>Delivered Products</span>
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem asChild>
                        <Link
                          href={`/expired-products`}
                          className="cursor-pointer"
                        >
                          <RiPassExpiredFill className="mr-2 h-4 w-4" />
                          <span>Expired Products</span>
                        </Link>
                      </DropdownMenuItem> */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/change-password`}
                          className="cursor-pointer"
                        >
                          <FaKey className="mr-2 h-4 w-4" />
                          <span>Change Password</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/profile`} className="cursor-pointer">
                          <FaUser className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 dark:text-red-400 cursor-pointer"
                        onClick={() => handleLogout()}
                      >
                        <LogOut className="mr-2 h-4 w-4 font-bold" />
                        <span className="font-bold">Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button asChild variant="primary" size="lg" className=" ">
                    <Link href="/login">
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Sign in
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Cart Drawer */}
      <CartDrawer
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
        cartItems={cartItems}
        subtotal={subtotal}
        onRemove={handleRemoveFromCart}
        onUpdateQty={handleUpdateQty}
        onViewCart={() => {
          setIsCartOpen(false);
          router.push("/view-cart");
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          router.push("/checkout");
        }}
      />
    </>
  );
}
