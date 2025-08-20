import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import CleanBodyAttributes from "@/components/CleanBodyAttributes";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata = {
  title: "Genius",
  description: "E-Commerce with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning={true} className={`${outfit.className} antialiased text-gray-700`}>
          <CleanBodyAttributes />
          <Toaster />
          {/* ✅ Moved AppContextProvider inside ClerkProvider */}
          <AppContextProvider>{children}</AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
