import type { Metadata } from "next";
import "@mikala/ui/src/styles/globals.css";

export const metadata: Metadata = {
  title: "Mikala Klien",
  description: "Aplikasi untuk Klien Mikala",
  manifest: "/manifest.json",
  themeColor: "#10B981",
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
