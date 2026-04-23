import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800"] });

// const inter = Inter({ subsets: ["latin"] });
//const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata: Metadata = {
    title: "Weather Dashboard",
    description: "Premium Glassmorphism Weather Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
      <html lang="en">
        <body className={montserrat.className}>{children}</body>
        {/* <body className={poppins.className}></body> */}
        {/* <body className={poppins.className}></body> */}
      </html>
    );
}
