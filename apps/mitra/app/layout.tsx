import type { Metadata } from "next";
import "@mikala/ui/src/styles/globals.css";

export const metadata: Metadata = {
  title: "Mikala Mitra",
  description: "Aplikasi untuk Mitra Mikala",
  manifest: "/manifest.json",
  themeColor: "#4F46E5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
