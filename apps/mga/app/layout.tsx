import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Mikala Garda Akademi",
  description: "Program pelatihan dan sertifikasi tenaga kesehatan profesional",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
