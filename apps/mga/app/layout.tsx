import type { Metadata } from "next";
import "@mikala/ui/src/styles/globals.css";

export const metadata: Metadata = {
  title: "Mikala Garda Akademi - Training & Development",
  description: "Program pelatihan dan sertifikasi tenaga kesehatan profesional",
  keywords: ["training", "perawat", "sertifikasi", "akademi", "pendidikan"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
