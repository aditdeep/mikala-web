import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Mikala Garda Medika",
  description: "Layanan perawatan kesehatan profesional di rumah Anda",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
