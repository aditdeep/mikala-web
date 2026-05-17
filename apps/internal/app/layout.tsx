import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
export const metadata: Metadata = { icons: { icon: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png', apple: 'https://res.cloudinary.com/djgtchmsx/image/upload/v1779020551/Favicon_MGM_nmpyxc.png' },
  title: "Mikala Internal", description: "Internal Management System" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
