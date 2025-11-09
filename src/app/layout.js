import { Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { authOptions } from "./api/auth/[...nextauth]/route";
import NextAuthProvider from "@/provider/NextAuthProvider";
import { getServerSession } from "next-auth";
import Main from "@/components/Main/Main";

const urbanist = Urbanist({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Digital Premium Store",
  description:
    "Digital Premium Store is a digital store for premium products. It is a platform for selling digital products to the world.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={urbanist.className} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-gray-100">
        <NextAuthProvider session={session}>
          <Navbar />
          {/* <main className="flex-grow container mx-auto px-4">{children}</main> */}
          <Main>{children}</Main>
          <Toaster />
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
